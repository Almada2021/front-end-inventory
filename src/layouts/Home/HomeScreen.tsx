interface Props {
  show: boolean;
}
export default function HomeScreen({ show }: Props) {
  if (!show) return null;
  return (
    <main className="p-20">
      <h2 className="text-3xl font-bold">Bienvenido Tobias Almada </h2>
    </main>
  );
}
