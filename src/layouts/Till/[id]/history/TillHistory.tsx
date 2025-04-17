import { useParams } from "react-router";
import useTransfertHistory from "@/hooks/transfert-history/useTransfertHistory";
import { useState } from "react";

export default function TillHistory() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useTransfertHistory(id!, {
    page,
    limit: 10,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <div>
        <h1>Historial de transferencias</h1>
      </div>
      <div>{JSON.stringify(data)}</div>
    </>
  );
}
