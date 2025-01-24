import ProviderCard from "@/components/Cards/Provider/ProviderCard";
import useProviders from "@/hooks/providers/useProviders";
import { ProviderModel } from "@/infrastructure/interfaces/provider.interface";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";

export default function ShowSupplier() {
  const { providersQuery } = useProviders();
  if (providersQuery.isFetching && providersQuery.data) {
    return <LoadingScreen />;
  }
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-11 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center items-center place-items-center">
        {providersQuery.data?.map((prov: ProviderModel) => (
          <>
            <ProviderCard provider={prov} />
          </>
        ))}
      </div>
    </div>
  );
}
