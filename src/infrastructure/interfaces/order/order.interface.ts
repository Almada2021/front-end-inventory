export interface OrdersResponse {
  orders: Order[];
  numberOfPages: number;
}

export interface SingeOrderRes {
  order: Order;
}
export type OrderStatus =
  | "open"
  | "closed"
  | "cancelled"
  | "partially"
  | "returned";
type Translations = {
  [key in OrderStatus]: string;
};

export const StatusTranslations: Translations = {
  open: "Pendiente",
  closed: "Cerrado",
  cancelled: "Cancelado",
  partially: "Parcialmente",
  returned: "Devuelto",
};
export interface Order {
  id: string;
  name: string;
  status: OrderStatus;
  products: ProductElement[];
  storeId: string;
  date: Date;
  providerId: string;
  amount: number;
  partialDescription?: string;
}

export interface ProductElement {
  product: ProductProduct;
  quantity: number;
  received?: number;
  isReceived?: boolean;
  notes?: string;
}

export interface ProductProduct {
  id: string;
  stock: number;
  photoUrl: string;
  barCode: string;
}
