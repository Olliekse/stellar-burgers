import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  onDrop: (ingredient: TIngredient) => void;
};
