/**
 * Type definitions for the Stellar Burger application
 * This file contains all the TypeScript interfaces and types used throughout the app
 */

/**
 * Represents a single ingredient from the API
 * Contains all properties of an ingredient including nutritional info and images
 */
export type TIngredient = {
  _id: string; // Unique identifier from the API
  name: string; // Display name of the ingredient
  type: string; // Category: 'bun', 'sauce', or 'main'
  proteins: number; // Protein content in grams
  fat: number; // Fat content in grams
  carbohydrates: number; // Carbohydrate content in grams
  calories: number; // Caloric content
  price: number; // Price in currency units
  image: string; // URL to the small image
  image_large: string; // URL to the large image for modals
  image_mobile: string; // URL to the mobile-optimized image
};

/**
 * Extends the base ingredient type with properties needed for the burger constructor
 * Adds unique identifiers for drag-and-drop functionality
 */
export type TConstructorIngredient = TIngredient & {
  id: string; // ID for React keys
  uuid: string; // Unique identifier for each instance in the constructor
};

/**
 * Represents an order from the API
 * Contains order details including status and ingredients
 */
export type TOrder = {
  _id: string; // Unique identifier from the API
  status: string; // Order status: 'created', 'pending', 'done'
  name: string; // Name of the burger order
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
  number: number; // Order number for display
  ingredients: string[]; // Array of ingredient IDs
};

/**
 * Response structure for orders data from the API
 * Contains arrays of orders and statistics
 */
export type TOrdersData = {
  orders: TOrder[]; // Array of order objects
  total: number; // Total number of orders ever made
  totalToday: number; // Number of orders made today
};

/**
 * User information returned from the API
 * Contains basic user profile data
 */
export type TUser = {
  email: string; // User's email address
  name: string; // User's display name
};

/**
 * Tab types for ingredient filtering
 * Used in the BurgerIngredients component
 */
export type TTabMode = 'bun' | 'sauce' | 'main';

/**
 * Form data structure for user profile updates
 * All fields are optional to allow partial updates
 */
export type TUserForm = {
  name?: string; // User's display name
  email?: string; // User's email address
  password?: string; // User's password
};

/**
 * Form data structure for user login
 * Email and password are required
 */
export type TLoginForm = {
  email: string; // User's email address
  password: string; // User's password
};

/**
 * Form data structure for user registration
 * All fields are required
 */
export type TRegisterForm = {
  name: string; // User's display name
  email: string; // User's email address
  password: string; // User's password
};

/**
 * Form data structure for password reset
 * Used in the reset password flow
 */
export type TResetPasswordForm = {
  password: string; // New password
  token: string; // Reset token from email
};
