import { BackendApi } from "@/core/api/api";
import { ClientsResponse } from "@/infrastructure/interfaces/clients/clients.response";

export const getClientAction = async (query?: string, limit?: number) => {
  try {
    if(!query) return { clients: []}
    const clients = await BackendApi.get<ClientsResponse>("/client/search", {
      params: { query, limit },
    });
    return clients.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
