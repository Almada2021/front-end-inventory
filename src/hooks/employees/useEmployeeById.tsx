import { getEmployeeByIdAction } from "@/core/actions/employee/getEmployeeById.action"
import { useQuery } from "@tanstack/react-query"

export default function useEmployeeById(id: string | undefined) {
    const emplooyeByIdQuery = useQuery({
        queryFn: () => getEmployeeByIdAction(id || ""),
        queryKey: ["employee", id]
    })

  return {
    emplooyeByIdQuery
  }
}
