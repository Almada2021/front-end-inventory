import { getSaleByProductIdAction } from "@/core/actions/sales/getSaleByProductId.action"
import { useQuery } from "@tanstack/react-query"

export default function useSalesByProductId(id: string) {
    const salesByProductQuery= useQuery({
        queryKey: ["product"],
        queryFn: () => getSaleByProductIdAction(id),
        enabled: id.length > 1,
    })
    return ({
        salesByProductQuery
    }
  )
}
