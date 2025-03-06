import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  selectIngredients,
  selectOrders
} from '../../slices/stellarBurgerSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useAppSelector(selectIngredients);
  const orders = useAppSelector(selectOrders);

  const orderData = orders.find((order) => order.number === Number(number));

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: { [key: string]: TIngredient & { count: number } }, id: string) => {
        const ingredient = ingredients.find((item) => item._id === id);
        if (!ingredient) return acc;

        if (acc[id]) {
          acc[id].count++;
        } else {
          acc[id] = { ...ingredient, count: 1 };
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    const date = new Date(orderData.createdAt);

    return {
      ingredientsInfo,
      date,
      total,
      ...orderData
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
