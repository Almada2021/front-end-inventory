export interface OrdersResponse {
  orders: Order[];
}

export interface SingeOrderRes {
  order: Order;
}
export type OrderStatus = "open" | "closed" | "cancelled" | "partially";
type Translations = {
  [key in OrderStatus]: string;
};

export const StatusTranslations: Translations = {
  open: "Pendiente",
  closed: "Cerrado",
  cancelled: "Cancelado",
  partially: "Parcialmente",
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
