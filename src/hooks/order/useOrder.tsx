import { getOrderByIdAction } from "@/core/actions/orders/getOrderById";
import { useQuery } from "@tanstack/react-query";

export default function useOrder(id: string) {
    const orderByIdQuery = useQuery({
        queryFn: () => getOrderByIdAction(id),
        queryKey: ['orders', "id"],
        staleTime: 1000 * 60 * 10,
    },
)
    return {
        orderByIdQuery
    }
}
