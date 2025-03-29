import stellarBurgerReducer, {
  createOrderThunk,
  fetchIngredients
} from '../stellarBurgerSlice';

describe('stellarBurger order creation', () => {
  const initialState = stellarBurgerReducer(undefined, { type: '' });
  const mockOrder = {
    _id: '643d69a5c3f7b9001cfa093f',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093d'],
    status: 'done',
    name: 'Space Burger',
    createdAt: '2023-03-25T12:00:00.000Z',
    updatedAt: '2023-03-25T12:00:00.000Z',
    number: 12345
  };

  it('should handle order creation request', () => {
    const action = createOrderThunk.pending('', []);
    const state = stellarBurgerReducer(initialState, action);

    expect(state.orderRequest).toBe(true);
    expect(state.orderFailed).toBe(false);
    expect(state.order).toBeNull();
  });

  it('should handle successful order creation', () => {
    const action = createOrderThunk.fulfilled(mockOrder, '', []);
    const state = stellarBurgerReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderFailed).toBe(false);
    expect(state.order).toEqual(mockOrder);
  });

  it('should handle failed order creation', () => {
    const error = 'Failed to create order';
    const action = createOrderThunk.rejected(new Error(error), '', []);
    const state = stellarBurgerReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderFailed).toBe(true);
    expect(state.order).toBeNull();
  });

  it('should handle ingredients fetch request', () => {
    const action = fetchIngredients.pending('', undefined);
    const state = stellarBurgerReducer(initialState, action);

    expect(state.ingredientsRequest).toBe(true);
    expect(state.ingredientsFailed).toBe(false);
    expect(state.ingredients).toEqual([]);
  });

  it('should handle successful ingredients fetch', () => {
    const mockIngredients = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      }
    ];

    const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
    const state = stellarBurgerReducer(initialState, action);

    expect(state.ingredientsRequest).toBe(false);
    expect(state.ingredientsFailed).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('should handle failed ingredients fetch', () => {
    const error = 'Failed to fetch ingredients';
    const action = fetchIngredients.rejected(new Error(error), '', undefined);
    const state = stellarBurgerReducer(initialState, action);

    expect(state.ingredientsRequest).toBe(false);
    expect(state.ingredientsFailed).toBe(true);
    expect(state.ingredients).toEqual([]);
  });
});
