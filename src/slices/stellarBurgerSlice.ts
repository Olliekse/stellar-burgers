/**
 * Redux Toolkit slice for the Stellar Burger application
 * This file contains the main state management logic for the application
 * including reducers, actions, and async thunks for API interactions
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../services/store';
import {
  getIngredientsApi,
  getFeedsApi,
  getUserOrdersApi,
  orderBurgerApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../utils/burger-api';
import { deleteCookie, setCookie } from '../utils/cookie';
import {
  TIngredient,
  TOrder,
  TUser,
  TUserForm,
  TLoginForm,
  TRegisterForm,
  TResetPasswordForm
} from '../utils/types';

/**
 * Extended ingredient type for the burger constructor
 * Adds unique identifiers for drag-and-drop functionality
 */
export type TConstructorIngredient = TIngredient & { uuid: string; id: string };

/**
 * Main state interface for the Stellar Burger application
 * Contains all the state needed for the application
 */
interface StellarBurgerState {
  // Auth state
  user: TUser | null;
  isAuthenticated: boolean;
  authRequest: boolean;
  authFailed: boolean;

  // Ingredients state
  ingredients: TIngredient[];
  ingredientsRequest: boolean;
  ingredientsFailed: boolean;

  // Constructor state
  constructorIngredients: TConstructorIngredient[];
  bun: TIngredient | null;

  // Order state
  order: TOrder | null;
  orderRequest: boolean;
  orderFailed: boolean;

  // Feed state
  orders: TOrder[];
  feedRequest: boolean;
  feedFailed: boolean;
  total: number;
  totalToday: number;

  // User orders state
  userOrders: TOrder[];
  userOrdersRequest: boolean;
  userOrdersFailed: boolean;

  // Modal state
  isModalOpened: boolean;

  // Password reset state
  forgotPasswordSuccess: boolean;
  resetPasswordSuccess: boolean;
}

/**
 * Initial state for the Redux store
 * Sets default values for all state properties
 */
const initialState: StellarBurgerState = {
  // Auth state
  user: null,
  isAuthenticated: false,
  authRequest: false,
  authFailed: false,

  // Ingredients state
  ingredients: [],
  ingredientsRequest: false,
  ingredientsFailed: false,

  // Constructor state
  constructorIngredients: [],
  bun: null,

  // Order state
  order: null,
  orderRequest: false,
  orderFailed: false,

  // Feed state
  orders: [],
  feedRequest: false,
  feedFailed: false,
  total: 0,
  totalToday: 0,

  // User orders state
  userOrders: [],
  userOrdersRequest: false,
  userOrdersFailed: false,

  // Modal state
  isModalOpened: false,

  // Password reset state
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false
};

// Async thunks
/**
 * Fetches all available ingredients from the API
 */
export const fetchIngredients = createAsyncThunk(
  'stellarBurger/fetchIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

/**
 * Fetches the public feed of orders
 */
export const fetchFeed = createAsyncThunk(
  'stellarBurger/fetchFeed',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

/**
 * Fetches orders for the currently authenticated user
 */
export const fetchUserOrders = createAsyncThunk(
  'stellarBurger/fetchUserOrders',
  async () => {
    const response = await getUserOrdersApi();
    return response;
  }
);

/**
 * Creates a new order with the specified ingredients
 * @param ingredientIds - Array of ingredient IDs
 */
export const createOrderThunk = createAsyncThunk(
  'stellarBurger/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

/**
 * Authenticates a user with email and password
 * @param form - Login form data
 */
export const loginThunk = createAsyncThunk(
  'stellarBurger/login',
  async (form: TLoginForm) => {
    const response = await loginUserApi(form);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response.user;
  }
);

/**
 * Registers a new user
 * @param form - Registration form data
 */
export const registerThunk = createAsyncThunk(
  'stellarBurger/register',
  async (form: TRegisterForm) => {
    const response = await registerUserApi(form);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response.user;
  }
);

/**
 * Logs out the current user
 * Clears authentication tokens
 */
export const logoutThunk = createAsyncThunk(
  'stellarBurger/logout',
  async () => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

/**
 * Fetches the current user's profile data
 */
export const getUserThunk = createAsyncThunk(
  'stellarBurger/getUser',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

/**
 * Updates the current user's profile data
 * @param form - User form data
 */
export const updateUserThunk = createAsyncThunk(
  'stellarBurger/updateUser',
  async (form: TUserForm) => {
    const response = await updateUserApi(form);
    return response.user;
  }
);

/**
 * Initiates the password reset process
 * @param email - User's email address
 */
export const forgotPasswordThunk = createAsyncThunk(
  'stellarBurger/forgotPassword',
  async (email: string) => {
    const response = await forgotPasswordApi({ email });
    return response.success;
  }
);

/**
 * Completes the password reset process
 * @param form - Reset password form
 */
export const resetPasswordThunk = createAsyncThunk(
  'stellarBurger/resetPassword',
  async (form: TResetPasswordForm) => {
    const response = await resetPasswordApi(form);
    return response.success;
  }
);

/**
 * Main Redux slice for the Stellar Burger application
 * Contains reducers for all actions and handles async thunk states
 */
const stellarBurgerSlice = createSlice({
  name: 'stellarBurger',
  initialState,
  reducers: {
    /**
     * Initializes the application state
     * Sets authentication status based on user data
     */
    init: (state) => {
      // Initialize app state if needed
      state.isAuthenticated = !!state.user;
    },

    /**
     * Adds an ingredient to the burger constructor
     * Handles both buns and other ingredients differently
     */
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.constructorIngredients.push(action.payload);
      }
    },

    /**
     * Adds a bun to the burger constructor
     * Replaces any existing bun
     */
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    /**
     * Resets the burger constructor to empty
     */
    resetConstructor: (state) => {
      state.constructorIngredients = [];
      state.bun = null;
    },

    /**
     * Removes a specific ingredient from the constructor
     * @param uuid - Unique identifier of the ingredient to remove
     */
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (item) => item.uuid !== action.payload
      );
    },

    /**
     * Reorders ingredients in the constructor (for drag and drop)
     * @param dragIndex - Index of the ingredient being dragged
     * @param hoverIndex - Index where the ingredient is being dropped
     */
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.constructorIngredients[dragIndex];
      const newConstructorIngredients = [...state.constructorIngredients];
      newConstructorIngredients.splice(dragIndex, 1);
      newConstructorIngredients.splice(hoverIndex, 0, dragItem);
      state.constructorIngredients = newConstructorIngredients;
    },

    /**
     * Clears the burger constructor
     * Used after placing an order
     */
    clearConstructor: (state) => {
      state.constructorIngredients = [];
      state.bun = null;
    },

    openModal: (state) => {
      state.isModalOpened = true;
    },
    closeModal: (state) => {
      state.isModalOpened = false;
    },
    resetOrder: (state) => {
      state.order = null;
    },
    resetPasswordStates: (state) => {
      state.forgotPasswordSuccess = false;
      state.resetPasswordSuccess = false;
    }
  },
  extraReducers: (builder) => {
    // Ingredients
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.ingredientsRequest = true;
        state.ingredientsFailed = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.ingredientsRequest = false;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.ingredientsRequest = false;
        state.ingredientsFailed = true;
      });

    // Feed
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedRequest = true;
        state.feedFailed = false;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.feedRequest = false;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.feedRequest = false;
        state.feedFailed = true;
      });

    // User Orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersRequest = true;
        state.userOrdersFailed = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload.orders;
        state.userOrdersRequest = false;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.userOrdersRequest = false;
        state.userOrdersFailed = true;
      });

    // Create Order
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.orderFailed = false;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.order = action.payload;
        state.orderRequest = false;
        state.isModalOpened = true;
      })
      .addCase(createOrderThunk.rejected, (state) => {
        state.orderRequest = false;
        state.orderFailed = true;
      });

    // Auth
    builder
      .addCase(loginThunk.pending, (state) => {
        state.authRequest = true;
        state.authFailed = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authRequest = false;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.authRequest = false;
        state.authFailed = true;
      });

    builder
      .addCase(registerThunk.pending, (state) => {
        state.authRequest = true;
        state.authFailed = false;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authRequest = false;
      })
      .addCase(registerThunk.rejected, (state) => {
        state.authRequest = false;
        state.authFailed = true;
      });

    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });

    builder
      .addCase(getUserThunk.pending, (state) => {
        state.authRequest = true;
        state.authFailed = false;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authRequest = false;
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.authRequest = false;
        state.authFailed = true;
      });

    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.authRequest = true;
        state.authFailed = false;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authRequest = false;
      })
      .addCase(updateUserThunk.rejected, (state) => {
        state.authRequest = false;
        state.authFailed = true;
      });

    // Password reset
    builder.addCase(forgotPasswordThunk.fulfilled, (state, action) => {
      state.forgotPasswordSuccess = action.payload;
    });

    builder.addCase(resetPasswordThunk.fulfilled, (state, action) => {
      state.resetPasswordSuccess = action.payload;
    });
  }
});

// Actions
export const {
  init,
  addIngredient,
  addBun,
  resetConstructor,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  openModal,
  closeModal,
  resetOrder,
  resetPasswordStates
} = stellarBurgerSlice.actions;

// Selectors
/**
 * Selector functions for accessing state in components
 * These provide a clean way to access specific parts of the state
 */
export const selectIngredients = (state: RootState) =>
  state.stellarBurger.ingredients;
export const selectConstructorIngredients = (state: RootState) =>
  state.stellarBurger.constructorIngredients;
export const selectBun = (state: RootState) => state.stellarBurger.bun;
export const selectOrder = (state: RootState) => state.stellarBurger.order;
export const selectOrders = (state: RootState) => state.stellarBurger.orders;
export const selectUserOrders = (state: RootState) =>
  state.stellarBurger.userOrders;
export const selectUser = (state: RootState) => state.stellarBurger.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.stellarBurger.isAuthenticated;
export const selectIsModalOpened = (state: RootState) =>
  state.stellarBurger.isModalOpened;
export const selectForgotPasswordSuccess = (state: RootState) =>
  state.stellarBurger.forgotPasswordSuccess;
export const selectResetPasswordSuccess = (state: RootState) =>
  state.stellarBurger.resetPasswordSuccess;

export default stellarBurgerSlice.reducer;
