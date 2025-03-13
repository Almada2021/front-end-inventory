import { getAllClientsAction } from "@/core/actions/employee/getAllClients.action";
import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";
import { useQuery } from "@tanstack/react-query";

const defaultOptions = {
  limit: 10,
  page: 1,
};
export default function useClients(
  options: FilterOptionsRequest = defaultOptions
) {
  const queryAllClients = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      return await getAllClientsAction(options);
    },
  });
  return { queryAllClients };
}
