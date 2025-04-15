import { getSalesByClientAction } from "@/core/actions/sales/getSalesByClient.action"
import { useQuery } from "@tanstack/react-query"

export const useSalesByClient = (id: string) => {
    const getSalesByClientQuery = useQuery({
        queryKey: ["sales", "client", id],
        queryFn: () => getSalesByClientAction(id),
        enabled: id.length > 0
    })
    return ({
        getSalesByClientQuery
    })
}