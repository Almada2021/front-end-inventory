import { BackendApi } from "@/core/api/api";
import { SalesResponse } from "@/infrastructure/interfaces/sale/sale.interface";

export const getSalesByClientAction = async (id: string) => {
    try {
        const sales = await BackendApi.get<SalesResponse>(`/sale/client/${id}`)
        return sales.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}