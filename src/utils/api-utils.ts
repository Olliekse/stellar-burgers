/**
 * API utilities for making requests to the backend
 * This file contains the universal request function and helper functions
 */
import {
  TIngredient,
  TOrdersData,
  TUser,
  TLoginForm,
  TRegisterForm,
  TResetPasswordForm,
  TUserForm,
  TOrder
} from './types';
import { getCookie, setCookie } from './cookie';

// Base URL for all API requests
export const BASE_URL = 'https://norma.nomoreparties.space/api';

// Define a generic type for API responses
export interface ApiResponse {
  success: boolean;
  [key: string]: unknown;
}

// User response type
export interface UserResponse extends ApiResponse {
  user: TUser;
  accessToken: string;
  refreshToken: string;
}

// Order response type
export interface OrderResponse extends ApiResponse {
  order: TOrder;
}

/**
 * Helper function to check if the response is OK
 * @param res - The fetch Response object
 * @returns A Promise that resolves to the parsed JSON or rejects with an error
 */
const checkResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json();
  }
  // Throw an error to be caught in the catch block
  return Promise.reject(`Error ${res.status}`);
};

/**
 * Helper function to check if the response has success: true
 * @param res - The parsed JSON response
 * @returns The response if successful, or rejects with an error
 */
const checkSuccess = <T extends ApiResponse>(res: T): T => {
  if (res && res.success) {
    return res;
  }
  // Throw an error to be caught in the catch block
  return Promise.reject(
    `Response not successful: ${JSON.stringify(res)}`
  ) as never;
};

/**
 * Universal request function that handles common request logic
 * @param endpoint - The API endpoint (without the base URL)
 * @param options - Fetch options (optional)
 * @returns A Promise that resolves to the parsed and validated response
 */
export const request = <T extends ApiResponse>(
  endpoint: string,
  options?: RequestInit
): Promise<T> =>
  fetch(`${BASE_URL}/${endpoint}`, options)
    .then((res) => checkResponse<T>(res))
    .then((res) => checkSuccess<T>(res));

/**
 * Refreshes the authentication token
 * @returns Promise with new tokens
 */
export const refreshToken = () =>
  request<UserResponse>('auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });

/**
 * Fetch with token refresh capability
 * @param endpoint - API endpoint
 * @param options - Fetch options
 * @returns Promise with API response
 */
export const fetchWithRefresh = async <T extends ApiResponse>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (err) {
    if ((err as Error).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);

      // Update Authorization header with new token
      const headers = options.headers as Record<string, string>;
      headers.Authorization = refreshData.accessToken;

      return await request<T>(endpoint, options);
    } else {
      return Promise.reject(err);
    }
  }
};

// API Functions

/**
 * Fetches all available ingredients from the API
 * @returns Promise with ingredient data
 */
export const getIngredients = () =>
  request<ApiResponse & { data: TIngredient[] }>('ingredients').then(
    (response) => response.data
  );

// Export the old function name for compatibility
export const getIngredientsApi = getIngredients;

/**
 * Fetches the public feed of orders
 * @returns Promise with orders data
 */
export const getFeeds = () => request<ApiResponse & TOrdersData>('orders/all');

// Export the old function name for compatibility
export const getFeedsApi = getFeeds;

/**
 * Fetches orders for the currently authenticated user
 * @returns Promise with the user's orders data
 */
export const getUserOrders = () => {
  const token = getCookie('accessToken');
  if (!token) {
    return Promise.reject(new Error('No token found'));
  }
  return fetchWithRefresh<ApiResponse & TOrdersData>('orders/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  });
};

// Export the old function name for compatibility
export const getUserOrdersApi = getUserOrders;

/**
 * Creates a new order with the specified ingredients
 * @param ingredients - Array of ingredient IDs
 * @returns Promise with the created order data
 */
export const orderBurger = (ingredients: string[]) => {
  const token = getCookie('accessToken');
  return request<OrderResponse>('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? 'Bearer ' + token : ''
    },
    body: JSON.stringify({ ingredients })
  });
};

// Export the old function name for compatibility
export const orderBurgerApi = orderBurger;

/**
 * Authenticates a user with email and password
 * @param form - Login form data
 * @returns Promise with user data and tokens
 */
export const loginUser = (form: TLoginForm) =>
  request<UserResponse>('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });

// Export the old function name for compatibility
export const loginUserApi = loginUser;

/**
 * Registers a new user
 * @param form - Registration form data
 * @returns Promise with user data and tokens
 */
export const registerUser = (form: TRegisterForm) =>
  request<UserResponse>('auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });

// Export the old function name for compatibility
export const registerUserApi = registerUser;

/**
 * Logs out the current user
 * @returns Promise indicating success
 */
export const logout = () =>
  request<ApiResponse>('auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });

// Export the old function name for compatibility
export const logoutApi = logout;

/**
 * Gets the current user's data
 * @returns Promise with user data
 */
export const getUser = () => {
  const token = getCookie('accessToken');
  if (!token) {
    return Promise.reject(new Error('No token found'));
  }
  return fetchWithRefresh<ApiResponse & { user: TUser }>('auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  });
};

// Export the old function name for compatibility
export const getUserApi = getUser;

/**
 * Updates the current user's data
 * @param form - User form data
 * @returns Promise with updated user data
 */
export const updateUser = (form: TUserForm) => {
  const token = getCookie('accessToken');
  if (!token) {
    return Promise.reject(new Error('No token found'));
  }
  return fetchWithRefresh<ApiResponse & { user: TUser }>('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify(form)
  });
};

// Export the old function name for compatibility
export const updateUserApi = updateUser;

/**
 * Initiates password reset process
 * @param emailOrForm - User's email or form with email
 * @returns Promise indicating success
 */
export const forgotPassword = (emailOrForm: string | { email: string }) => {
  const email =
    typeof emailOrForm === 'string' ? emailOrForm : emailOrForm.email;
  return request<ApiResponse>('password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
};

// Export the old function name for compatibility
export const forgotPasswordApi = forgotPassword;

/**
 * Completes password reset process
 * @param form - Reset password form data
 * @returns Promise indicating success
 */
export const resetPassword = (form: TResetPasswordForm) =>
  request<ApiResponse>('password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });

// Export the old function name for compatibility
export const resetPasswordApi = resetPassword;
