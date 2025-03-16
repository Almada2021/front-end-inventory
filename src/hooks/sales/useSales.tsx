import { getSalesActions } from "@/core/actions/sales/getSales.action";
import { useQuery } from "@tanstack/react-query";

interface Options {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}
export default function useSales({ page, limit, startDate, endDate }: Options) {
  const salesQuery = useQuery({
    queryFn: () => getSalesActions({ page, limit, startDate, endDate }),
    queryKey: ["sales", page, limit, startDate, endDate],
  })
    return {salesQuery};
}
