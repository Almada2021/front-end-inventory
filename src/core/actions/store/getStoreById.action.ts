import { BackendApi } from "@/core/api/api";
export interface SingleStoreResponse {
  id: string;
  name: string;
  address: string;
  employeesIds: string[];
  tillIds: string[];
}

export const getStoreByIdAction = async (
  id: string
): Promise<SingleStoreResponse> => {
  try {
    const response = await BackendApi.get<SingleStoreResponse>(
      `/stores/show/${id}`
    );
    if (!response.data) throw new Error("Store Not Found");
    return response.data;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};
