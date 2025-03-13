import { BackendApi } from "@/core/api/api";
import {
  Client,
  ClientsResponse,
} from "@/infrastructure/interfaces/clients/clients.response";

import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";

export const getAllClientsAction = async ({
  limit,
  page,
}: FilterOptionsRequest): Promise<Client[]> => {
  try {
    const { data } = await BackendApi.get<ClientsResponse>("/products/all", {
      params: {
        limit,
        page,
      },
    });
    return data.clients;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
