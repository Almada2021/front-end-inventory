export interface ProductResponse {
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  uncounted: boolean;
  photoUrl: string;
  basePrice: number;
  providers: string[];
  salesIds: string[];
  orderIds: string[];
  barCode?: string;
  rfef?: string;
  sellByWeight?: boolean;
  weightUnit?: string;
}
