export interface TillOpensClose {
  id: string;
  tillId: string;
  openingAmount: number;
  closingAmount: number;
  openingTime: string;
  closingTime?: string;
  status: "open" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

export interface TillOpensCloseResponse {
  data: TillOpensClose[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TillOpensCloseFilters {
  page?: number;
  limit?: number;
  status?: "open" | "closed";
}
