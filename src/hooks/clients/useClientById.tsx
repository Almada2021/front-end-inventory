import { getClientByIdAction } from "@/core/actions/clients/getClientById.action";
import { useQuery } from "@tanstack/react-query";

export const useClientById = (id: string) => {
  const clientByIdQuery = useQuery({
    queryFn: () => getClientByIdAction(id),
    queryKey: ["client", id],
    enabled: id.length > 0,
    staleTime: 1000 * 60 * 5,
  });
  return {
    clientByIdQuery,
  };
};
