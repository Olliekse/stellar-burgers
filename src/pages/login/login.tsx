import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store';
import { loginThunk } from '../../slices/stellarBurgerSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      await dispatch(loginThunk({ email, password }));
      const { from } = location.state || { from: { pathname: '/' } };
      navigate(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorText={error}
      handleSubmit={handleSubmit}
    />
  );
};
