import { useParams } from "react-router";
export default function SupplierInfo() {
  const { id } = useParams<{ id: string }>();
  return <div>SupplierInfo {id}</div>;
}
