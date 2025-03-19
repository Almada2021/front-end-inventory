import { getAllEmployeesAction } from "@/core/actions/employee/getAllEmployees.action";
import { useQuery } from "@tanstack/react-query";

export default function useEmployees() {
  const employeesQuery = useQuery({
    queryFn: () => getAllEmployeesAction(),
    queryKey: ["employees"],
  });
  return { employeesQuery };
}
