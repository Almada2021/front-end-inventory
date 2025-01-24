import { BackendApi } from "@/core/api/api";
import {
  BackendProviderAPIResponse,
  ProviderModel,
} from "@/infrastructure/interfaces/provider.interface";
import { ProviderMapper } from "@/infrastructure/mappers/provider.mapper";

export const getProvidersAction = async (): Promise<
  ProviderModel[] | undefined
> => {
  try {
    const providers = await BackendApi.get<BackendProviderAPIResponse>(
      "/providers/all"
    );
    if (!providers.data) {
      return [];
    }
    return providers.data.providers.map(ProviderMapper.fromBackToFront);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
