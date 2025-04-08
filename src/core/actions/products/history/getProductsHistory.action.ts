import { BackendApi } from "@/core/api/api"
import { ProductHistoryResponse } from "@/infrastructure/interfaces/product-history/product-history";

export const getHistoryProducAction = async (id: string) => {
    try {
        const history = await BackendApi.get<ProductHistoryResponse>(`/history-products/id/${id}`);
        return history.data
    } catch (error) {
        console.error(error);
        throw error;
    }
}