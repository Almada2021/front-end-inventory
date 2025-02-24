import useImg from "@/hooks/img/useImg";

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
}
export default function Image({ src, ...props }: Props) {
  const { data, isLoading, isError } = useImg(src);
  if (isLoading) return null;
  if (isError) return <img src="" alt="Error" />;

  return <img src={data} {...props}></img>;
}
