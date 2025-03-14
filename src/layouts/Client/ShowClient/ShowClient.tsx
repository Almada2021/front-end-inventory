import CustomerCard from "@/components/Cards/CustomerCard/CustomerCard";
import useClients from "@/hooks/clients/useClients";
import { Client } from "@/infrastructure/interfaces/clients/clients.response";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";

export default function ShowClient() {
  const { queryAllClients } = useClients({ page: 1, limit: 1000 });
  if (queryAllClients.isFetching || !queryAllClients.data)
    return <LoadingScreen />;

  return (
    <div className="mt-20 sm:mt-0 min-h-screen w-full p-4 flex flex-col">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
      gap-4 w-full"
        style={{ gridAutoRows: "minmax(0, 1fr)" }}
      >
        {queryAllClients.data?.map((client: Client) => (
          <CustomerCard key={client.id} client={client} />
        ))}
      </div>
      <div className="h-24 flex items-center justify-center border-t">
        {/* Pagination or additional controls */}
      </div>
    </div>
  );
}
