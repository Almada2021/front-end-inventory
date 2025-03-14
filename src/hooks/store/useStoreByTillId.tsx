import { getStoreByTillIdAction } from "@/core/actions/store/getStoreByTillId.action";
import { useQuery } from "@tanstack/react-query";

export default function useStoreByTillId(id: string) {
  const storeByTillId = useQuery({
    queryKey: ["stores", "by", "till", "id", id],
    queryFn: () => getStoreByTillIdAction(id),
  });
  return {
    storeByTillId,
  };
}
