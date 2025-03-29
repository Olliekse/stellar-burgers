import {
  ingredientsReducer,
  initialState,
  getIngredientsRequest,
  getIngredientsSuccess,
  getIngredientsFailed
} from '../ingredientsSlice';

describe('ingredients reducer', () => {
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

  it('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle getIngredientsRequest', () => {
    const action = getIngredientsRequest();
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle getIngredientsSuccess', () => {
    const action = getIngredientsSuccess(mockIngredients);
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.data).toEqual(mockIngredients);
  });

  it('should handle getIngredientsFailed', () => {
    const error = 'Failed to fetch ingredients';
    const action = getIngredientsFailed(error);
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
    expect(state.data).toEqual([]);
  });
});
