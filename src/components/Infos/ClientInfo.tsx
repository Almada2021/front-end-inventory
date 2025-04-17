import { useClientById } from "@/hooks/clients/useClientById";
import { Client } from "@/infrastructure/interfaces/clients/clients.response";

type keys = keyof Client;
interface Props {
  clientId: string;
  keyValue: keys;
  renderFn?: (data: Client) => React.ReactNode;
}

export default function ClientInfo({ clientId, keyValue, renderFn }: Props) {
  const { clientByIdQuery } = useClientById(clientId || "");
  const { data, isFetching } = clientByIdQuery;
  if (isFetching) return null;
  if (!data) return null;
  if (data?.name && data?.name.length === 0) {
    return null;
  }
  if (renderFn) {
    return renderFn(data);
  }
  return <>{data[keyValue]}</>;
}
