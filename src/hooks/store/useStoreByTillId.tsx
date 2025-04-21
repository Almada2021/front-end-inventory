import { STALE_24 } from "@/constants/time/time";
import { getStoreByTillIdAction } from "@/core/actions/store/getStoreByTillId.action";
import { useQuery } from "@tanstack/react-query";

export default function useStoreByTillId(id: string) {
  const storeByTillId = useQuery({
    queryKey: ["stores", "by", "till", "id", id],
    queryFn: () => getStoreByTillIdAction(id),
    enabled: id.length > 0,
    staleTime: STALE_24,
    gcTime: 1000 * 60 * 5,
  });
  return {
    storeByTillId,
  };
}
