import { BackendApi } from "@/core/api/api";
import { BackendProviderAPIResponse } from "@/infrastructure/interfaces/provider.interface";
import { ProviderMapper } from "@/infrastructure/mappers/provider.mapper";

export const searchProviderAction = async (query: string) => {
  try {
    const { data } = await BackendApi.post<BackendProviderAPIResponse>(
      "/providers/search",
      {
        query,
      }
    );
    return data.providers.map(ProviderMapper.fromBackToFront);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
