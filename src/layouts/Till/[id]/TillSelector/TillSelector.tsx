import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTills from "@/hooks/till/useTills";
import { Till } from "@/infrastructure/interfaces/till.interface";

interface Props {
  storeId: string;
  selectTill: (id: string) => void;
}
export default function TillSelector({ storeId, selectTill }: Props) {
  const { tillsByStoreQuery } = useTills(storeId);
  if (tillsByStoreQuery.isFetching) return null;
  return (
    <div className="min-w-[200px] flex flex-col">
      <h3 className="m-2">Seleccionar una caja</h3>
      <Select onValueChange={selectTill}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar el valor de la caja" />
        </SelectTrigger>
        <SelectContent>
          {tillsByStoreQuery.data?.tills.map((till: Till) => {
            return (
              <SelectItem key={till.id} value={till.id}>
                {till.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
