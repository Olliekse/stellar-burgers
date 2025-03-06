import { OrderInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/OrderInfo',
  component: OrderInfoUI,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OrderInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOrderInfo: Story = {
  args: {
    orderInfo: {
      ingredientsInfo: {
        bun: {
          _id: '60d3b41abdacab0026a733c6',
          name: 'Булка',
          type: 'bun',
          proteins: 12,
          fat: 23,
          carbohydrates: 45,
          calories: 56,
          price: 67,
          image: 'https://code.s3.yandex.net/react/code/bun-01.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
          count: 2
        }
      },
      date: new Date('2024-01-25'),
      total: 134,
      _id: '233',
      status: 'ready',
      name: 'Order',
      createdAt: '2024-01-25T12:00:00.000Z',
      updatedAt: '2024-01-25T12:00:00.000Z',
      number: 2,
      ingredients: ['60d3b41abdacab0026a733c6']
    }
  }
};
