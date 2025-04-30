import { getStockReportAction } from "@/core/actions/products/getStockReport.action";
import { useQuery } from "@tanstack/react-query";

export default function useStockReport() {
  const getStockReportQuery = useQuery({
    queryKey: ["getStockReport"],
    queryFn: () => getStockReportAction(),
  });
  return {
    getStockReportQuery,
  };
}
