import { getUserByIdAction } from "@/core/actions/users/getUserByIdAction.action";
import { useQuery } from "@tanstack/react-query";

export default function useUserById(id: string) {
  const userByIdQuery = useQuery({
    queryKey: ["user", "show", id],
    queryFn: () => getUserByIdAction(id),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 60,
  });
  return {
    userByIdQuery,
  };
}
