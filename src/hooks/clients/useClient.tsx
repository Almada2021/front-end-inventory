import { useQuery } from "@tanstack/react-query";

export default function useClient(query: string) {
  const getClientQuery  = useQuery({
    queryFn: () => {},
    queryKey: ["client", query],
  });
  return { getClientQuery };
}
