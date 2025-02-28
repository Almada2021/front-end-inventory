import { BackendApi } from "@/core/api/api";
import { Till } from "@/infrastructure/interfaces/till.interface";

export const getTillById = async (id: string): Promise<Till> => {
  try {
    const tills = await BackendApi.get<Till>(`/till/show/${id}`);
    return tills.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
