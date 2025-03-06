import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import {
  closeModal,
  fetchFeed,
  fetchIngredients,
  getUserThunk,
  init,
  selectIngredients,
  selectIsAuthenticated,
  selectIsModalOpened,
  selectOrders
} from '../../slices/stellarBurgerSlice';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { useAppDispatch, useAppSelector } from '../../services/store';

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const isModalOpened = useAppSelector(selectIsModalOpened);
  const token = getCookie('accessToken');
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const ingredients = useAppSelector(selectIngredients);
  const feed = useAppSelector(selectOrders);

  useEffect(() => {
    if (!isAuthenticated && token) {
      dispatch(getUserThunk())
        .unwrap()
        .then(() => {
          dispatch(init());
        })
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else {
      dispatch(init());
    }
  }, []);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, []);

  useEffect(() => {
    if (!feed.length) {
      dispatch(fetchFeed());
    }
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute unAuthOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute unAuthOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {isModalOpened && backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Описание ингредиента'
                onClose={() => {
                  dispatch(closeModal());
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Заказ'
                onClose={() => {
                  dispatch(closeModal());
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Заказ'
                  onClose={() => {
                    dispatch(closeModal());
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
