export interface TillOpensClose {
  id: string;
  tillId: string;
  openingAmount: number;
  closingAmount?: number | null;
  openingTime: string;
  closingTime?: string | null;
  status: "open" | "closed";
  createdAt?: string;
  updatedAt?: string;
}
