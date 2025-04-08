import useImg from "@/hooks/img/useImg";

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
}
export default function Image({ src, ...props }: Props) {
 
  const isAnURL = /^(https?:\/\/)/.test(src);
  const { data, isLoading, isError } = useImg(isAnURL ? src : `${import.meta.env.VITE_BACKEND_URL}/static/${src}`);
  if (isLoading) return null;
  if (isError) return <img src="" alt="Error" />;
  if (!src) {
    return null;
  }

  return <img src={data} {...props}></img>;
}
