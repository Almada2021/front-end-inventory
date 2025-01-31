import { BackendApi } from "@/core/api/api";
import {
  BackendProviderAPIResponse,
  ProviderModel,
} from "@/infrastructure/interfaces/provider.interface";
import { ProviderMapper } from "@/infrastructure/mappers/provider.mapper";

interface RequestOptions {
  page: number;
  limit: number;
}
export const getProvidersAction = async ({
  page,
  limit,
}: RequestOptions): Promise<ProviderModel[]> => {
  try {
    const providers = await BackendApi.get<BackendProviderAPIResponse>(
      "/providers/all",
      {
        params: {
          page: page,
          limit: limit,
        },
      }
    );
    if (providers.data.providers.length == 0) {
      return [];
    }
    return providers.data.providers.map(ProviderMapper.fromBackToFront);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
};
