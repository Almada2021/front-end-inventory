import { BackendApi } from "@/core/api/api";
import { TransfertHistory } from "@/infrastructure/interfaces/transfert-history/transfert-history..interface";

export const getTransfertHistoryByIdAction = async (id: string) => {
  try {
    const response = await BackendApi.get<TransfertHistory>(
      `/transferts-history/id/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
