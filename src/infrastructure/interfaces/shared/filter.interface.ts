export interface FilterOptionsRequest {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}
