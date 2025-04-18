import { BackendApi } from "@/core/api/api";
import {
  TillOpensCloseResponse,
  TillOpensCloseFilters,
} from "@/infrastructure/interfaces/till-opens-close.interface";

export const getTillOpensCloseHistory = async (
  tillId: string,
  filters?: TillOpensCloseFilters
): Promise<TillOpensCloseResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.status) params.append("status", filters.status);

    const response = await BackendApi.get<TillOpensCloseResponse>(
      `/till-opens-close/till/${tillId}?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching till opens/close history:", error);
    throw error;
  }
};
