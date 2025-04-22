import { BackendApi } from "@/core/api/api";
import { Till, TillFilters } from "@/infrastructure/interfaces/till.interface";
export interface TillByStoreResponse {
  tills: Till[];
}

export const getTillByStoreId = async (
  id: string,
  filters?: TillFilters,
  isAdmin?: boolean
): Promise<{ tills: Till[] }> => {
  try {
    const tills = await BackendApi.get<TillByStoreResponse>(
      `/till/store/${id}`,
      {
        params: {
          ...filters,
          admin: isAdmin,
        },
      }
    );
    return tills.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
