import { rest } from 'msw';
import { mockIngredients, mockOrders } from './data';

export const handlers = [
  rest.get(
    'https://norma.nomoreparties.space/api/ingredients',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ success: true, data: mockIngredients })
      );
    }
  ),

  rest.post('https://norma.nomoreparties.space/api/orders', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true, name: 'test-order', order: mockOrders[0] })
    );
  }),

  rest.get(
    'https://norma.nomoreparties.space/api/orders/:id',
    (req, res, ctx) => {
      const { id } = req.params;
      const order = mockOrders.find((order) => order._id === id);

      if (!order) {
        return res(
          ctx.status(404),
          ctx.json({ success: false, message: 'Order not found' })
        );
      }

      return res(ctx.status(200), ctx.json({ success: true, orders: [order] }));
    }
  )
];
