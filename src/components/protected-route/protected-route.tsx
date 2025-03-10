import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectAuthRequest
} from '../../slices/stellarBurgerSlice';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  children: ReactNode;
  unAuthOnly?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  unAuthOnly = false
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authRequest = useAppSelector(selectAuthRequest);
  const location = useLocation();

  // Show preloader while checking authentication
  // Only show preloader if we're not in "unAuthOnly" mode (which is for login/register pages)
  // or if we are in "unAuthOnly" mode but there's a token being verified
  if (authRequest && (!unAuthOnly || (unAuthOnly && isAuthenticated))) {
    return <Preloader />;
  }

  // For routes that should only be accessible when NOT authenticated (login, register, etc.)
  if (unAuthOnly && isAuthenticated) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // For protected routes that require authentication
  if (!unAuthOnly && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <>{children}</>;
};
