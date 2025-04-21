export interface TransfertHistoryResponse {
  history: TransfertHistory[];
  numberOfPages: number;
}

export interface TransfertHistory {
  id: string;
  amount: number;
  user: string;
  method: string;
  bills: Record<string, number>;
  createdAt: string;
  receipt?: string;
  receptor?: string;
}
