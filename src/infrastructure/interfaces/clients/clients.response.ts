export interface ClientsResponse {
  clients: Client[];
}

export interface Client {
  id: string;
  name: string;
  lastName: string;
  ruc: string;
  salesHistory: string[];
  address: string;
}
