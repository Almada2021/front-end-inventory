import { PaymentMethod } from "@/lib/database.types";

export interface SalesResponse {
  sales: Sale[];
}
export interface Sale {
  id: string;
  amount: number;
  profits: number;
  sellerId: string;
  products: Product[];
  till: string;
  createdAt: string;
  client: string;
  bills: Record<string, number>;
  billsCashBack: Record<string, number>;
  paymentMethod: PaymentMethod;
  reverted?: boolean;
}

export interface Product {
  product: string;
  quantity: number;
  cancelled: boolean;
  _id: string;
}

export interface CreateSaleDto {
  amount: number;
  profits: number;
  sellerId: string;
  products: {
    product: string;
    quantity: number;
    cancelled?: boolean;
  }[];
  till: string;
  bills: Record<string, number>;
  billsCashBack: Record<string, number>;
  paymentMethod: PaymentMethod;
  client?: string;
}
