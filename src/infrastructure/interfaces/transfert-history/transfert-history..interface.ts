export interface TransfertHistoryResponse {
  history: History[];
}

export interface History {
  id: string;
  amount: number;
  user: string;
  method: string;
  bills: Record<string, number>;
}
