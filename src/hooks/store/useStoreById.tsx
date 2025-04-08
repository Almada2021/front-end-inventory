import { getStoreByIdAction } from "@/core/actions/store/getStoreById.action";
import { useQuery } from "@tanstack/react-query";

export default function useStoreById(id: string) {
  const storeById = useQuery({
    queryKey: ["stores", "by", "id", id],
    queryFn: () => getStoreByIdAction(id),
    enabled: id.length > 0,
  });
  return {
    storeById,
  };
}
