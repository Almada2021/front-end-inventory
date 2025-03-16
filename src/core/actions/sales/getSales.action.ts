import { BackendApi } from "@/core/api/api";
import { Sale, SalesResponse } from "@/infrastructure/interfaces/sale/sale.interface";
import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";
 
export const getSalesActions =async(options: FilterOptionsRequest): Promise<Sale[]> => {
    try {
        const sales = await BackendApi.get<SalesResponse>("/sale", {
            params: options,
        })
        if(!sales.data) {
            throw new Error("Sales data not found");
        }
        return sales.data.sales
    } catch (error) {
        console.log(error);
        throw error;
    }
};