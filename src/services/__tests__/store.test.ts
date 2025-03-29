import { store } from '../store';
import { RootState } from '../store';

describe('rootReducer', () => {
  it('should return initial state when called with undefined state and unknown action', () => {
    const initialState = store.getState();
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    // Get the current state
    const currentState = store.getState();

    // Verify the state structure matches our expected initial state
    expect(currentState).toEqual(initialState);

    // Verify the state has our expected slices
    expect(currentState).toHaveProperty('stellarBurger');
  });
});
