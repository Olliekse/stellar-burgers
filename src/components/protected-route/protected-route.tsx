import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../../slices/stellarBurgerSlice';
import { useAppSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: ReactNode;
  unAuthOnly?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  unAuthOnly = false
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (unAuthOnly && isAuthenticated) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!unAuthOnly && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <>{children}</>;
};
