import { useParams } from "react-router";
import useTransfertHistory from "@/hooks/transfert-history/useTransfertHistory";
import { useState } from "react";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import PaginationButtons from "@/components/PaginationButtons/PaginationButtons";
import TransfertHistoryTable from "@/components/DataTable/transferts-history/TransfertHistoryTable";

export default function TillHistory() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { transfertHistoryQuery } = useTransfertHistory(id!, {
    page,
    limit,
  });
  const { data, isLoading, error, isFetching } = transfertHistoryQuery;
  if (isLoading || isFetching) {
    return (
      <div className="w-full h-screen flex justify-center items-center px-10">
        <LoadingScreen />
      </div>
    );
  }
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="mt-12 md:mt-4">
        <h1 className="text-2xl font-bold mx-4">Historial de transferencias</h1>
      </div>
      <div className="w-full px-4 md:px-0 overflow-x-scroll md:min-h-[80svh]">
        <TransfertHistoryTable transferts={data?.history || []} />
      </div>
      <div className="w-full flex justify-center items-center">
        <PaginationButtons
          currentPage={page}
          handlePageChange={(page) => setPage(page)}
          totalPages={Math.ceil(Number(data?.numberOfPages) / limit) || 1}
        />
      </div>
    </div>
  );
}
