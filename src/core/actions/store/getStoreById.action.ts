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
    const store = await BackendApi.get<SingleStoreResponse>(
      `/stores/show/${id}`
    );
    if (!store) throw "Store Not Found";
    return store.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
