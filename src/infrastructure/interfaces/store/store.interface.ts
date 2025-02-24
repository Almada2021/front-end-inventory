export interface StoreCreationResponse {
  store?: Store;
  err?: string;
}

export interface StoresResponse {
  stores: Store[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  employeesIds: string[];
  tillIds: string[];
}
