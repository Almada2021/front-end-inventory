import { BackendApi } from "@/core/api/api"
import { Sale } from "@/infrastructure/interfaces/sale/sale.interface";

export const getSaleById = async (id: string): Promise<Sale> => {
    try {
        
        const response = await BackendApi.get<Sale>(`/sale/id/${id}`);
        if (!response.data) {
            throw new Error("Sale data not found");
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}