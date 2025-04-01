import { getOrderAction } from "@/core/actions/orders/getOrders.action";
import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";
import { useQuery } from "@tanstack/react-query";

export default function useOrders(options: FilterOptionsRequest) {
    const getOrdersQuery = useQuery({
        queryFn: () => getOrderAction(options),
        queryKey: ['orders', options.startDate, options.endDate],
        staleTime: 1000 * 60 * 10,
    },
)
    return {
        getOrdersQuery
    }
}
