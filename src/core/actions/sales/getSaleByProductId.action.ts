import { BackendApi } from "@/core/api/api";
import { SalesResponse } from "@/infrastructure/interfaces/sale/sale.interface";

export const getSaleByProductIdAction = async (id: string): Promise<SalesResponse> => {
    try {
        
        const response = await BackendApi.get<SalesResponse>(`/sale/product/${id}`);
        if (!response.data) {
            throw new Error("Sale data not found");
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}