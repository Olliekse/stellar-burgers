import {
  TIngredient,
  TLoginForm,
  TOrdersData,
  TRegisterForm,
  TResetPasswordForm,
  TUser,
  TUserForm,
  TOrder
} from './types';
import { getCookie } from './cookie';

const API_URL = 'https://norma.nomoreparties.space/api';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const getIngredients = async () => {
  const res = await fetch(`${API_URL}/ingredients`);
  return checkResponse<{ success: boolean; data: TIngredient[] }>(res);
};

export const makeOrder = async (ingredients: string[]) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify({ ingredients })
  });
  return checkResponse<{ success: boolean; order: TOrder }>(res);
};

export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders/all`);
  return checkResponse<TOrdersData & { success: boolean }>(res);
};

export const getUserOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('accessToken') || ''
    }
  });
  return checkResponse<TOrdersData & { success: boolean }>(res);
};

export const login = async (form: TLoginForm) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
  return checkResponse<{
    success: boolean;
    accessToken: string;
    refreshToken: string;
    user: TUser;
  }>(res);
};

export const register = async (form: TRegisterForm) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
  return checkResponse<{
    success: boolean;
    accessToken: string;
    refreshToken: string;
    user: TUser;
  }>(res);
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });
  return checkResponse<{ success: boolean }>(res);
};

export const getUser = async () => {
  const res = await fetch(`${API_URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('accessToken') || ''
    }
  });
  return checkResponse<{ success: boolean; user: TUser }>(res);
};

export const updateUser = async (form: TUserForm) => {
  const res = await fetch(`${API_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify(form)
  });
  return checkResponse<{ success: boolean; user: TUser }>(res);
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API_URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  return checkResponse<{ success: boolean }>(res);
};

export const resetPassword = async (form: TResetPasswordForm) => {
  const res = await fetch(`${API_URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
  return checkResponse<{ success: boolean }>(res);
};
