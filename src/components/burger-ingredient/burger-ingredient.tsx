import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { addIngredient, addBun } from '../../slices/stellarBurgerSlice';
import { v4 as uuidv4 } from 'uuid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        const constructorIngredient = {
          ...ingredient,
          uuid: uuidv4(),
          id: ingredient._id
        };
        dispatch(addIngredient(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
