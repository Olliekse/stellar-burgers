/**
 * API utility functions for the Stellar Burger application
 * This file contains all the functions that interact with the backend API
 */
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

// Base URL for all API requests
const API_URL = 'https://norma.nomoreparties.space/api';

/**
 * Helper function to check API responses and handle errors
 * @param res - The fetch Response object
 * @returns A Promise that resolves to the parsed JSON or rejects with an error
 */
const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

/**
 * Fetches all available ingredients from the API
 * @returns Promise with ingredient data
 */
export const getIngredients = async () => {
  const res = await fetch(`${API_URL}/ingredients`);
  return checkResponse<{ success: boolean; data: TIngredient[] }>(res);
};

/**
 * Creates a new order with the specified ingredients
 * @param ingredients - Array of ingredient IDs
 * @returns Promise with the created order data
 */
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

/**
 * Fetches all orders from the API (public feed)
 * @returns Promise with orders data including statistics
 */
export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders/all`);
  return checkResponse<TOrdersData & { success: boolean }>(res);
};

/**
 * Fetches orders for the currently authenticated user
 * Requires authentication token
 * @returns Promise with the user's orders data
 */
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

/**
 * Authenticates a user with email and password
 * @param form - Login form data with email and password
 * @returns Promise with user data and authentication tokens
 */
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

/**
 * Registers a new user
 * @param form - Registration form data with name, email, and password
 * @returns Promise with user data and authentication tokens
 */
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

/**
 * Logs out the current user by invalidating their refresh token
 * @returns Promise indicating success or failure
 */
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

/**
 * Fetches the current user's profile data
 * Requires authentication token
 * @returns Promise with user data
 */
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

/**
 * Updates the current user's profile data
 * Requires authentication token
 * @param form - User form data with optional name, email, and password
 * @returns Promise with updated user data
 */
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

/**
 * Initiates the password reset process by sending a reset email
 * @param email - User's email address
 * @returns Promise indicating success or failure
 */
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

/**
 * Completes the password reset process with a new password and token
 * @param form - Reset password form with new password and reset token
 * @returns Promise indicating success or failure
 */
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
