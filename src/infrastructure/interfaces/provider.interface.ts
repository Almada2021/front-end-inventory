export interface BackendProviderAPIResponse {
  providers: ProviderModel[];
}

export interface ProviderModel {
  id: string;
  name: string;
  seller: string;
  phoneNumber: string;
  sheet: string;
  productsIds: string[];
  ordersIds: string[];
}
