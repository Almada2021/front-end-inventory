import { Product } from "../products.interface";

export type CartInterface = {
  id: string;
  product: Product;
  quantity: number;
  uncounted: boolean;
  stock: number;
};
