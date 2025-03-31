import {
  constructorReducer,
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../constructorSlice';

describe('constructor reducer', () => {
  const mockBun = {
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
  };

  const mockMainIngredient = {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  };

  it('should return the initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle adding a bun', () => {
    const action = addIngredient({ ingredient: mockBun, type: 'bun' });
    const state = constructorReducer(initialState, action);

    expect(state.bun).toEqual(mockBun);
    expect(state.main).toEqual([]);
  });

  it('should handle adding a main ingredient', () => {
    const action = addIngredient({
      ingredient: mockMainIngredient,
      type: 'main'
    });
    const state = constructorReducer(initialState, action);

    expect(state.bun).toBeNull();
    expect(state.main).toEqual([mockMainIngredient]);
  });

  it('should handle removing a main ingredient', () => {
    // First add an ingredient
    const addAction = addIngredient({
      ingredient: mockMainIngredient,
      type: 'main'
    });
    let state = constructorReducer(initialState, addAction);

    // Then remove it
    const removeAction = removeIngredient(0);
    state = constructorReducer(state, removeAction);

    expect(state.main).toEqual([]);
  });

  it('should handle moving ingredients', () => {
    // First add two ingredients
    const addAction1 = addIngredient({
      ingredient: mockMainIngredient,
      type: 'main'
    });
    let state = constructorReducer(initialState, addAction1);

    const mockMainIngredient2 = {
      ...mockMainIngredient,
      _id: '643d69a5c3f7b9001cfa093e'
    };
    const addAction2 = addIngredient({
      ingredient: mockMainIngredient2,
      type: 'main'
    });
    state = constructorReducer(state, addAction2);

    // Move the first ingredient to the end
    const moveAction = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
    state = constructorReducer(state, moveAction);

    expect(state.main[0]).toEqual(mockMainIngredient2);
    expect(state.main[1]).toEqual(mockMainIngredient);
  });
});
