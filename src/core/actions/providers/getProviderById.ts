import { BackendApi } from "@/core/api/api";
import { ProviderModel } from "@/infrastructure/interfaces/provider.interface";
import { ProviderMapper } from "@/infrastructure/mappers/provider.mapper";

export const getProviderByIdAction = async (id: string) => {
  try {
    const { data } = await BackendApi.get<ProviderModel>(`/providers/${id}`);
    return ProviderMapper.fromBackToFront(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
