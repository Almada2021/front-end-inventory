import { getEmployeeByIdAction } from "@/core/actions/employee/getEmployeeById.action";
import { useQuery } from "@tanstack/react-query";

export default function useEmployeeById(id: string | undefined) {
  const emplooyeByIdQuery = useQuery({
    queryFn: () => getEmployeeByIdAction(id || ""),
    queryKey: ["employee", id],
    enabled: !!id && id !== "undefined" && id.length > 0,
  });

  return {
    emplooyeByIdQuery,
  };
}
