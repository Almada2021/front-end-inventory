import { getTopSellingProducts } from "@/core/actions/stats/top-selling.action"
import { useQuery } from "@tanstack/react-query"

export default function useTopSelling() {
    const topSellingQuery = useQuery({
        queryFn: () => getTopSellingProducts(),
        queryKey: ["top-selling-products"]
    })
  return ({topSellingQuery});
}
