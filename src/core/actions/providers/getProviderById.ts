import { BackendApi } from "@/core/api/api";
import { ProviderModel } from "@/infrastructure/interfaces/provider.interface";
import { ProviderMapper } from "@/infrastructure/mappers/provider.mapper";

export const getProviderByIdAction = async (id: string) => {
  try {
    const response = await BackendApi.get<ProviderModel>(`/providers/${id}`);
    return ProviderMapper.fromBackToFront(response.data);
  } catch (error) {
    console.error('Error fetching provider:', error);
    throw error; // Re-throw to allow proper error handling in the component
  }
};
