import { STALE_24 } from "@/constants/time/time";
import { useQuery } from "@tanstack/react-query";

const fetchImg = async (src: string) => {
  const res = await fetch(src);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};
export default function useImg(src: string) {
  const imgQuery = useQuery({
    queryKey: ["img", src],
    queryFn: () => fetchImg(src),
    staleTime: Infinity,
    refetchInterval: STALE_24 * 7,
    retry: 3,
  });
  return imgQuery;
}
