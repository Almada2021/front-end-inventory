import useImg from "@/hooks/img/useImg";

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
}
export default function Image({ src, ...props }: Props) {
  // Check if it's a blob URL (local preview)
  // src exists verify
  const isBlobUrl = src.startsWith("blob:");
  // Check if it's an external URL
  const isAnURL = /^(https?:\/\/)/.test(src);
  // Always call the hook, but we'll only use its result for backend URLs
  const { data, isLoading, isError } = useImg(
    !isBlobUrl && !isAnURL
      ? `${import.meta.env.VITE_BACKEND_URL}/static/${src}`
      : ""
  );
  if (!src) return null;

  // For blob URLs or external URLs, use the src directly
  if (isBlobUrl || isAnURL) {
    return <img src={src} {...props} />;
  }

  // For backend URLs, use the useImg hook result
  if (isLoading) return null;
  if (isError) return <img src="" alt="Error" />;
  if (!src) {
    return null;
  }

  return <img src={data} {...props} />;
}
