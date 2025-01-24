import { BackendApi } from "@/core/api/api";

export type DeleteProviderResponse = {
  success: boolean;
  message: string;
};

export const deleteProviderAction = async (
  id: string
): Promise<DeleteProviderResponse> => {
  try {
    const { data } = await BackendApi.delete(`/providers/delete/${id}`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    throw error; // Lanza el error para que React Query lo maneje
  }
};
