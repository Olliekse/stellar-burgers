import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BurgerConstructor } from '../burger-constructor';
import { mockIngredients } from '../../../mocks/data';
import stellarBurgerReducer from '../../../slices/stellarBurgerSlice';
import { v4 as uuidv4 } from 'uuid';
import { TIngredient } from '@utils-types';
import { BrowserRouter as Router } from 'react-router-dom';

interface ConstructorItems {
  bun: TIngredient | null;
  ingredients: TIngredient[];
}

interface BurgerConstructorUIProps {
  constructorItems: ConstructorItems;
  price: number;
}

interface ModalProps {
  children: React.ReactNode;
}

const constructorIngredients = mockIngredients.map((ingredient) => ({
  ...ingredient,
  uuid: uuidv4(),
  id: ingredient._id
}));

const store = configureStore({
  reducer: {
    stellarBurger: stellarBurgerReducer
  },
  preloadedState: {
    stellarBurger: {
      user: null,
      isAuthenticated: false,
      authRequest: false,
      authFailed: false,
      ingredients: [],
      ingredientsRequest: false,
      ingredientsFailed: false,
      constructorIngredients,
      bun: mockIngredients[0],
      order: null,
      orderRequest: false,
      orderFailed: false,
      orders: [],
      feedRequest: false,
      feedFailed: false,
      total: 0,
      totalToday: 0,
      userOrders: [],
      userOrdersRequest: false,
      userOrdersFailed: false,
      isModalOpened: false,
      forgotPasswordSuccess: false,
      resetPasswordSuccess: false
    }
  }
});

// Mock the UI components
jest.mock('@ui', () => ({
  BurgerConstructorUI: ({
    constructorItems,
    price
  }: BurgerConstructorUIProps) => (
    <section data-testid='burger-constructor'>
      {constructorItems.bun && <div>{constructorItems.bun.name}</div>}
      {constructorItems.ingredients.map((ingredient) => (
        <div key={ingredient._id}>{ingredient.name}</div>
      ))}
      <div>{price}</div>
    </section>
  ),
  Modal: ({ children }: ModalProps) => <div>{children}</div>,
  Preloader: () => <div>Loading...</div>,
  OrderDetailsUI: () => <div>Order Details</div>
}));

describe('BurgerConstructor', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <Provider store={store}>
          <BurgerConstructor />
        </Provider>
      </Router>
    );
    expect(screen.getByTestId('burger-constructor')).toBeInTheDocument();
  });

  it('displays the bun and ingredients', () => {
    render(
      <Router>
        <Provider store={store}>
          <BurgerConstructor />
        </Provider>
      </Router>
    );

    // Check if bun is rendered (it appears twice - top and bottom)
    expect(screen.getAllByText('Краторная булка N-200i')).toHaveLength(2);

    // Check if main ingredient is rendered
    expect(
      screen.getByText('Филе Люминесцентного тетраодонтимформа')
    ).toBeInTheDocument();
  });
});
