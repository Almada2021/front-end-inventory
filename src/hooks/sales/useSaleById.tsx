import { STALE_24 } from "@/constants/time/time";
import { getSaleById } from "@/core/actions/sales/getSaleById.action";
import { useQuery } from "@tanstack/react-query";

export default function useSaleById(id: string) {
  const salesByIdQuery = useQuery({
    queryFn: () => getSaleById(id),
    queryKey: ["sales", id],
    staleTime: STALE_24 / 8,
  });
  return { salesByIdQuery };
}
