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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import { searchProviderAction } from "@/core/actions/providers/searchProvider.action";
import { useToast } from "@/hooks/use-toast";
export default function ShowSupplier() {
  const [page, setPage] = useState(1);
  const { providersQuery } = useProviders({ page, limit: 12 });
  const navigate = useNavigate();
  const [providersSearched, setSearchedProviders] = useState<ProviderModel[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [existPrevious, setExistPrevious] = useState(false);
  const { toast } = useToast();
  let length = 0;
  const ChangePage = (val: number) => {
    if (val + page <= 0) return;
    setPage(page + val);
  };

  if (providersQuery.isFetching && providersQuery.data) {
    return <LoadingScreen />;
  }
  if (providersSearched.length > 0) {
    return (
      <div className="container mx-auto p-6 ">
        <div className="w-full ">
          <Button
            onClick={() => {
              setSearchedProviders([]);
            }}
          >
            <ArrowLeftCircleIcon size={20} />
            Volver
          </Button>
        </div>
        <div className="w-full">
          <h3 className="text-3xl font-bold">Buscaste: {searchQuery}</h3>
        </div>
        <div className="grid grid-cols-1 min-h-[80dvh] sm:grid-cols-11 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center items-center place-items-center m-6">
          {providersSearched.map((prov: ProviderModel) => (
            <div key={prov.id}>
              <ProviderCard
                onDeleteLength={() => {
                  if (page > 1) ChangePage(-1);
                }}
                length={length}
                provider={prov}
              />
            </div>
          ))}
          {providersSearched.length < 12 &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((element: number) => {
              if (providersSearched.length >= element) return null;
              return (
                <div key={`unknow-${element}`}>
                  <ProviderCard
                    provider={{
                      id: "",
                      name: "",
                      ordersIds: [],
                      phoneNumber: "",
                      productsIds: [],
                      seller: "",
                      sheet: "",
                    }}
                    className="invisible"
                  ></ProviderCard>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  if (providersQuery.data?.length == 0) {
    if (page != 1) setPage(page - 1);
    return (
      <div className="container mx-auto p-6 ">
        <section className="h-full flex flex-col">
          <h2 className="text-4xl font-bold">No se Encontraron Proveedores</h2>

          <section className="w-full  h-5/6 flex flex-col items-center justify-center gap-3">
            <h3 className="text-2xl">
              Todavia no tienes ningun proveedor creado
            </h3>
            <Frown size={60} />
            <Button
              onClick={() => {
                navigate("../new");
              }}
            >
              Crear uno nuevo
            </Button>
          </section>
        </section>
      </div>
    );
  }
  if (providersQuery.data) length = providersQuery.data.length;

  return (
    <div className="container mx-auto ">
      <SearchBar<ProviderModel>
        mutateFunction={searchProviderAction}
        mutationKey={["Search", "providers"]}
        onGetData={(data: ProviderModel[] | undefined) => {
          if (data && data.length > 0) {
            setSearchedProviders(data);
            return;
          } else {
            toast({
              variant: "destructive",
              title: "No Se encontraron Resultados",
              description: "Busque otra cosa...",
            });
          }
        }}
        onNotify={(query: string) => {
          setSearchQuery(query);
        }}
      />
      <div className="grid grid-cols-1 min-h-[80dvh] sm:grid-cols-11 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center items-center place-items-center m-6">
        {providersQuery.data?.map((prov: ProviderModel) => (
          <div key={prov.id}>
            <ProviderCard
              onDeleteLength={() => {
                if (page > 1) ChangePage(-1);
              }}
              length={length}
              provider={prov}
            />
          </div>
        ))}
        {providersQuery.data &&
          providersQuery.data?.length < 12 &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((element: number) => {
            if (providersQuery.data.length >= element) return null;
            return (
              <div key={`unknow-2-${element}`}>
                <ProviderCard
                  provider={{
                    id: "",
                    name: "",
                    ordersIds: [],
                    phoneNumber: "",
                    productsIds: [],
                    seller: "",
                    sheet: "",
                  }}
                  className="invisible"
                ></ProviderCard>
              </div>
            );
          })}
      </div>
      <section className=" w-full py-12">
        {(providersQuery.data?.length == 12 || existPrevious) && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => ChangePage(-1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem
                onClick={() => {
                  setExistPrevious(true);
                  ChangePage(1);
                }}
              >
                <PaginationLink>{page + 1}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
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
        )}
      </section>
    </div>
  );
}
