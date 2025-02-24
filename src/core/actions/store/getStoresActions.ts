import { BackendApi } from "@/core/api/api";
import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";
import {
  Store,
  StoresResponse,
} from "@/infrastructure/interfaces/store/store.interface";

export const getStoresAction = async ({
  limit,
  page,
}: FilterOptionsRequest): Promise<Store[]> => {
  try {
    const { data } = await BackendApi.get<StoresResponse>("/stores/show", {
      params: {
        limit,
        page,
      },
    });
    return data.stores;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
