import { getHistoryProducAction } from "@/core/actions/products/history/getProductsHistory.action"
import { useQuery } from "@tanstack/react-query"

export default function useProductsHistory(id?: string) {
  const productHistoryQuery = useQuery({
    queryFn: () => getHistoryProducAction(id!),
    queryKey: ["history", "product", id],
    enabled: !!id,
  })
  return ({
    productHistoryQuery
  })
}
