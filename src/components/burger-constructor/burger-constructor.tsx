import { FC, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  addIngredient,
  addBun,
  resetConstructor,
  createOrderThunk,
  selectBun,
  selectConstructorIngredients,
  selectUser
} from '../../slices/stellarBurgerSlice';
import { TIngredient, TOrder } from '@utils-types';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentBun = useAppSelector(selectBun);
  const selectedIngredients = useAppSelector(selectConstructorIngredients);
  const user = useAppSelector(selectUser);
  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const price = useCallback(
    () =>
      (currentBun ? currentBun.price * 2 : 0) +
      selectedIngredients.reduce(
        (sum, ingredient) => sum + ingredient.price,
        0
      ),
    [currentBun, selectedIngredients]
  );

  const handleDrop = useCallback(
    (ingredient: TIngredient) => {
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
    },
    [dispatch]
  );

  const handleOrderClick = useCallback(async () => {
    if (!currentBun || selectedIngredients.length === 0) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setOrderRequest(true);
    try {
      const ingredients = [
        currentBun._id,
        ...selectedIngredients.map((ing) => ing._id),
        currentBun._id
      ];

      const order = await dispatch(createOrderThunk(ingredients)).unwrap();
      setOrderModalData(order);
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      setOrderRequest(false);
    }
  }, [currentBun, selectedIngredients, dispatch, user, navigate]);

  const closeOrderModal = useCallback(() => {
    setOrderModalData(null);
    dispatch(resetConstructor());
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={price()}
      constructorItems={{
        bun: currentBun,
        ingredients: selectedIngredients
      }}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={closeOrderModal}
      onDrop={handleDrop}
    />
  );
};
