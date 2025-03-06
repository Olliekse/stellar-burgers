/**
 * Redux store configuration for the Stellar Burger application
 * This file sets up the central Redux store using Redux Toolkit's configureStore
 */
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import stellarBurgerReducer from '../slices/stellarBurgerSlice';

/**
 * Configure and create the Redux store with our reducer
 * The store combines all reducers and middleware in one place
 */
export const store = configureStore({
  reducer: {
    stellarBurger: stellarBurgerReducer
  },
  // Enable Redux DevTools in development mode only
  devTools: process.env.NODE_ENV !== 'production'
});

/**
 * TypeScript type definitions for the store
 * These help with type safety when accessing state or dispatching actions
 */
// Infer the RootState type from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Infer the AppDispatch type from the store
export type AppDispatch = typeof store.dispatch;

/**
 * Custom hooks for typed dispatch and selector
 * These provide type safety when using Redux in components
 */
// Use throughout the app instead of plain useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Use throughout the app instead of plain useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
