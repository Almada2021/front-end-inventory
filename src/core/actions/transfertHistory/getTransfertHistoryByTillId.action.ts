import { BackendApi } from "@/core/api/api";
import { TransfertHistoryResponse } from "@/infrastructure/interfaces/transfert-history/transfert-history..interface";

interface Filters {
  page: number;
  limit: number;
}
export const getTransfertHistoryByTillIdAction = async (
  id: string,
  filters: Filters
) => {
  try {
    const response = await BackendApi.get<TransfertHistoryResponse>(
      `/transferts-history/${id}`,
      {
        params: filters,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
