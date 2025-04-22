import { BackendApi } from "@/core/api/api";
import { BackendProviderAPIResponse } from "@/infrastructure/interfaces/provider.interface";
import { ProviderMapper } from "@/infrastructure/mappers/provider.mapper";

export interface TillActionRequirements {
  name: string;
  storeId: string;
  bills: { [key: string]: number };
  type: string;
  admin: boolean;
}

export const NewTillAction = async ({
  name,
  storeId,
  bills,
  type,
  admin,
}: TillActionRequirements) => {
  try {
    const { data } = await BackendApi.post<BackendProviderAPIResponse>(
      "/till/create",
      {
        name,
        storeId,
        bills,
        type,
        admin,
      }
    );
    return data.providers.map(ProviderMapper.fromBackToFront);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
