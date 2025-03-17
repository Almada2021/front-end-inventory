import { getAllUsersAction } from "@/core/actions/users/getAllUsers.action";
import { useQuery } from "@tanstack/react-query";

export default function useUsers() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsersAction(),
  });
  return { usersQuery };
}
