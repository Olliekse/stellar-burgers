import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';
import { useAppDispatch } from '../../../services/store';
import { openModal } from '../../../slices/stellarBurgerSlice';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const {
      image,
      price,
      name,
      _id,
      type,
      calories,
      proteins,
      fat,
      carbohydrates
    } = ingredient;
    const dispatch = useAppDispatch();
    const index = 0; // This should be passed as a prop in a real implementation

    return (
      <li
        className={styles.container}
        data-testid={`${type === 'bun' ? 'bun' : 'ingredient'}_${index}`}
      >
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
          onClick={() => dispatch(openModal())}
          data-testid='ingredient_link'
        >
          {count && <Counter count={count} />}
          <img className={styles.img} src={image} alt='картинка ингредиента.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p
            className={`text text_type_main-default ${styles.text}`}
            data-testid='ingredient_name'
          >
            {name}
          </p>
          <div className={styles.details} style={{ display: 'none' }}>
            <p data-testid='ingredient_calories'>{calories}</p>
            <p data-testid='ingredient_proteins'>{proteins}</p>
            <p data-testid='ingredient_fat'>{fat}</p>
            <p data-testid='ingredient_carbs'>{carbohydrates}</p>
          </div>
        </Link>
        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
