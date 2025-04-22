import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStores } from "@/hooks/store/useStores";
import { Store } from "@/infrastructure/interfaces/store/store.interface";

interface Props {
  selectStore: (id: string) => void;
  currentStore?: string;
}

export default function StoreSelector({ selectStore, currentStore }: Props) {
  const { storesQuery } = useStores({ page: 1, limit: 200 });

  if (storesQuery.isFetching) return null;

  return (
    <div className="min-w-[200px] flex flex-col">
      <h3 className="m-2">Seleccionar una tienda</h3>
      <Select onValueChange={selectStore} defaultValue={currentStore}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar una tienda" />
        </SelectTrigger>
        <SelectContent>
          {storesQuery.data?.map((store: Store) => {
            return (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
