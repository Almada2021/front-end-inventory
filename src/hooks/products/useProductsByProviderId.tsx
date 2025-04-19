import { getProductsByProviderAction } from "@/core/actions/products/getProductsByProvider";
import { useQuery } from "@tanstack/react-query";

export default function useProductsByProviderId(providerId: string) {
  const queryProductsByProviderId = useQuery({
    queryKey: ["productsByProviderId", providerId],
    queryFn: () => getProductsByProviderAction({ providerId }),
    enabled: !!providerId && !!providerId.length && providerId.length > 0,
  });
  return { queryProductsByProviderId };
}
