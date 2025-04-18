import { BackendApi } from "@/core/api/api";
import { Sale } from "@/infrastructure/interfaces/sale/sale.interface";

export const revertSaleAction = async (id: string): Promise<Sale> => {
  try {
    const response = await BackendApi.patch<Sale>(`/sale/revert/${id}`);
    if (!response.data) {
      throw new Error("Failed to revert sale");
    }
    return response.data;
  } catch (error) {
    console.error("Error reverting sale:", error);
    throw error;
  }
};
