import { FC, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import {
  selectIngredients,
  selectOrders,
  selectUserOrders,
  fetchFeed,
  fetchUserOrders,
  fetchIngredients
} from '../../slices/stellarBurgerSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const orders = useAppSelector(selectOrders);
  const userOrders = useAppSelector(selectUserOrders);

  // Determine if we're in the profile section
  const isProfileOrder = location.pathname.includes('/profile');

  // Fetch data if needed
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }

    if (isProfileOrder && !userOrders.length) {
      dispatch(fetchUserOrders());
    } else if (!isProfileOrder && !orders.length) {
      dispatch(fetchFeed());
    }
  }, [
    dispatch,
    ingredients.length,
    orders.length,
    userOrders.length,
    isProfileOrder
  ]);

  // Find the order in either the general orders list or the user's orders list
  const orderData = useMemo(() => {
    const numericOrderNumber = Number(number);
    let foundOrder: TOrder | undefined;

    if (isProfileOrder) {
      foundOrder = userOrders.find(
        (order) => order.number === numericOrderNumber
      );
    } else {
      foundOrder = orders.find((order) => order.number === numericOrderNumber);
    }

    // If not found in the expected list, try the other list as a fallback
    if (!foundOrder) {
      foundOrder = isProfileOrder
        ? orders.find((order) => order.number === numericOrderNumber)
        : userOrders.find((order) => order.number === numericOrderNumber);
    }

    return foundOrder;
  }, [number, orders, userOrders, isProfileOrder]);

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

  // Show loading state while fetching data
  const isLoading =
    !ingredients.length ||
    (isProfileOrder && !userOrders.length) ||
    (!isProfileOrder && !orders.length);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div className='text text_type_main-medium'>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
