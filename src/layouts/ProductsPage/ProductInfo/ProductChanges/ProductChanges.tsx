import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Tag, DollarSign, Truck } from "lucide-react";
import useProductsHistory from "@/hooks/products/history/useProductsHistory";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import useProvider from "@/hooks/providers/useProvider";

interface Props {
  id: string;
}

const ChangeItem = ({
  icon: Icon,
  title,
  from,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  from: React.ReactNode;
  to: React.ReactNode;
}) => (
  <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
    <div className="flex items-center justify-center h-10 w-10 bg-background rounded-full">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1">
      <h4 className="font-medium mb-1.5">{title}</h4>
      <div className="flex gap-4 text-sm">
        <div className="flex-1 space-y-1">
          <p className="text-muted-foreground">Anterior:</p>
          <div className="text-foreground/90 line-clamp-2">{from || "-"}</div>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-muted-foreground">Nuevo:</p>
          <div className="text-foreground/90 line-clamp-2">{to || "-"}</div>
        </div>
      </div>
    </div>
  </div>
);

const ProviderGetter = ({providerId}:{providerId: string}) => {
    const {getProviderById} = useProvider(providerId);
    if(getProviderById.isFetching){
        return null;
    }
    return (
        <>
            {getProviderById.data?.name || null}
        </>
    )
};
const ProviderChange = ({
  from,
  to,
}: {
  from: string[] | string;
  to: string[] | string;
}) => {
  const normalize = (value: string | string[]) =>
    Array.isArray(value) ? value : [value];
  const oldProviders = normalize(from);
  const newProviders = normalize(to);

  const removed = oldProviders.filter((p) => !newProviders.includes(p));
  const added = newProviders.filter((p) => !oldProviders.includes(p));

  return (
    <div className="space-y-2">
      {removed.length > 0 && (
        <div className="flex items-center gap-2 text-destructive">
          <Truck className="w-4 h-4" />
          {removed.map((p) => (
            <span key={p} className="badge-destructive">
              <ProviderGetter
                providerId={p} 
              />
            </span>
          ))}
        </div>
      )}
      {added.length > 0 && (
        <div className="flex items-center gap-2 text-success">
          <Truck className="w-4 h-4" />
          {added.map((p) => (
            <span key={p} className="badge-success">
               <ProviderGetter
                providerId={p} 
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductChanges({ id }: Props) {
  const { productHistoryQuery } = useProductsHistory(id);
  const history = productHistoryQuery.data?.history;

  if (productHistoryQuery.isFetching) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  if (!history?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No hay registros de cambios
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.map((entry, index) => (
        <div key={index} className="border-l-2 pl-4 ml-3 relative">
          <div className="absolute w-3 h-3 bg-border rounded-full -left-[7px] top-0" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(entry.createdAt).toLocaleDateString("es-ES")}
              </span>
            </div>

            <div className="space-y-3">
              {entry.changes.name && (
                <ChangeItem
                  icon={Tag}
                  title="Nombre del producto"
                  from={entry.changes.name.from}
                  to={entry.changes.name.to}
                />
              )}

              {entry.changes.price && (
                <ChangeItem
                  icon={DollarSign}
                  title="Precio"
                  from={`${formatCurrency( Number(entry.changes.price.from))}`}
                  to={`${formatCurrency(Number(entry.changes.price.to))}`}
                />
              )}

              {entry.changes.providers && (
                <div className="p-3 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-background rounded-full">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium">Proveedores</h4>
                  </div>
                  <ProviderChange
                    from={entry.changes.providers.from}
                    to={entry.changes.providers.to}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
