import { useParams } from "react-router";

export default function ClientIdPage() {
  const { id } = useParams();

  return <div>Hola {id}</div>;
}
