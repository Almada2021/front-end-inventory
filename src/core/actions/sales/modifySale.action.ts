import { BackendApi } from "@/core/api/api";
import { Sale } from "@/infrastructure/interfaces/sale/sale.interface";
import { CreateSaleDto } from "@/infrastructure/interfaces/sale/sale.interface";

export const modifySaleAction = async (
  id: string,
  dto: CreateSaleDto
): Promise<Sale> => {
  try {
    const response = await BackendApi.patch<Sale>(`/sale/update/${id}`, dto);
    if (!response.data) {
      throw new Error("Failed to modify sale");
    }
    return response.data;
  } catch (error) {
    console.error("Error modifying sale:", error);
    throw error;
  }
};
