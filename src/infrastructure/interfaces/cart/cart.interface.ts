import { Product } from "../products.interface";

export type CartInterface = {
  id: string;
  product: Product;
  quantity: number;
};
