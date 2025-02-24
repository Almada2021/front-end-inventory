import { BackendApi } from "@/core/api/api";
import { Till } from "@/infrastructure/interfaces/till.interface";
export interface TillByStoreResponse {
  tills: Till[];
}

export const getTillByStoreId = async (
  id: string
): Promise<{ tills: Till[] }> => {
  try {
    const tills = await BackendApi.get<TillByStoreResponse>(
      `/till/store/${id}`
    );
    return tills.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
