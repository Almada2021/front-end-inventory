import ProviderCard from "@/components/Cards/Provider/ProviderCard";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/hooks/providers/useProviders";
import { ProviderModel } from "@/infrastructure/interfaces/provider.interface";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { ArrowLeftCircleIcon, Frown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import { searchProviderAction } from "@/core/actions/providers/searchProvider.action";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ShowSupplier() {
  const [page, setPage] = useState(1);
  const { providersQuery } = useProviders({ page, limit: 12 });
  const navigate = useNavigate();
  const [providersSearched, setSearchedProviders] = useState<ProviderModel[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [existPrevious, setExistPrevious] = useState(false);
  const { toast } = useToast();

  const ChangePage = (val: number) => {
    if (val + page <= 0) return;
    setPage(page + val);
  };

  if (providersQuery.isFetching && providersQuery.data) {
    return <LoadingScreen />;
  }

  if (providersSearched.length > 0) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setSearchedProviders([])}
            className="gap-2"
          >
            <ArrowLeftCircleIcon size={20} />
            Volver a todos los proveedores
          </Button>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {providersSearched.length} resultados
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {providersSearched.map((prov) => (
            <ProviderCard
              key={prov.id}
              provider={prov}
              onDeleteLength={() => page > 1 && ChangePage(-1)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (providersQuery.data?.length === 0) {
    if (page !== 1) setPage(page - 1);
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-2">
          <Frown className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">
            No hay proveedores
          </h1>
          <p className="text-muted-foreground">
            Comienza agregando un nuevo proveedor a tu sistema
          </p>
        </div>
        <Button onClick={() => navigate("../new")} size="lg">
          Crear nuevo proveedor
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <SearchBar<ProviderModel>
        mutateFunction={searchProviderAction}
        mutationKey={["Search", "providers"]}
        onGetData={(data: ProviderModel[] | undefined) => {
          if (data?.length) {
            setSearchedProviders(data);
          } else {
            toast({
              variant: "destructive",
              title: "No se encontraron resultados",
              description: "Prueba con otros términos de búsqueda",
            });
          }
        }}
        onNotify={(query: string) => setSearchQuery(query)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {providersQuery.data?.map((prov) => (
          <ProviderCard
            key={prov.id}
            provider={prov}
            onDeleteLength={() => page > 1 && ChangePage(-1)}
          />
        ))}
      </div>

      {(providersQuery.data?.length === 12 || existPrevious) && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => ChangePage(-1)}
                  isActive={page > 1}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>{page}</PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    setExistPrevious(true);
                    ChangePage(1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
