import { salesByDayDashboardAction } from "@/core/actions/graphs/sales-by-day.action";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function useSalesDashboard(date: Date, date2: Date) {
    const startDate = format(date, "yyyy-MM-dd");
    const endDate = format(date2, "yyyy-MM-dd");
    const salesByDayQuery = useQuery({
      queryFn: () => salesByDayDashboardAction(startDate, endDate),
      queryKey: ["salesByDay", "dashboard", startDate, endDate], // Include both dates in the query key
      staleTime: 1000 * 60 * 60 * 1
    });
  return {
    salesByDayQuery
  };
}