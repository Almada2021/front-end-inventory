import { useParams } from "react-router";

export default function SalesById() {
  const { id } = useParams();
  if(!id) return null;
  
  return <div>Sale {id}</div>;
}
