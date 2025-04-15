export interface Till {
  id: string;
  name: string;
  storeId: string;
  bills: { [key: string]: number };
  totalCash: number;
  cardPayments: number;
  transferPayments: number;
  status: boolean;
  type: "till" | "bankAcount";
}

export interface TillFilters {
  exclude?: string,
  type?: string,
}