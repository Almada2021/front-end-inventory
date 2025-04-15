import { STALE_24 } from "@/constants/time/time";
import { stockOptimizationAction } from "@/core/actions/ai/stock-optimization/stock-optimization.action";
import { useQuery } from "@tanstack/react-query";

export default function useAiReport({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const useAiReportQuery = useQuery({
    queryFn: () => stockOptimizationAction({startDate, endDate}),
    queryKey: ["ai", "report", startDate, endDate],
    staleTime: STALE_24,
  });
  return { useAiReportQuery };
}
