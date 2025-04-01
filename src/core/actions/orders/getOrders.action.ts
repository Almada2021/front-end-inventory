import { BackendApi } from "@/core/api/api";
import { OrdersResponse } from "@/infrastructure/interfaces/order/order.interface";
import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";

export const getOrderAction = async (options: FilterOptionsRequest) => {
    try {
        const orders = await BackendApi.get<OrdersResponse>("/order",{
            params: options
        });
        return orders.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}