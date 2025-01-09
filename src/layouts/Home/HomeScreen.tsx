interface Props {
  show: boolean;
}
export default function HomeScreen({ show }: Props) {
  if (!show) return null;
  return <div>Home</div>;
}
