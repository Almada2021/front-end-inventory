import { useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
interface Props<T> {
  mutateFunction: (query: string) => Promise<T[] | undefined>;
  mutationKey?: string[];
  onGetData?: (data: T[] | undefined) => void;
}
export default function SearchBar<T>({
  mutateFunction,
  mutationKey = ["random", "search"],
  onGetData,
}: Props<T>) {
  const [query, setQuery] = useState<string>("");
  const searchMutation = useMutation({
    mutationFn: (query: string) => mutateFunction(query),
    mutationKey: [...mutationKey, query],
    onSuccess: onGetData,
  });
  const SearchFunction = async () => {
    await searchMutation.mutate(query);
  };

  return (
    <section
      aria-description="Search bar"
      className="min-h-[120px] max-h-[140px] w-full flex justify-center items-center p-20"
    >
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          await SearchFunction();
        }}
        className="bg-white w-full md:w-10/12 rounded-full h-[60px] flex"
      >
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
          }}
          type="text"
          className="bg-white w-full md:w-11/12 rounded-l-full h-[60px]  focus:outline-none px-4 shadow-black shadow "
          aria-label="Buscar"
          title="Barra de Busqueda"
          placeholder="Ingresa el nombre del proveedor"
        ></input>
        <div
          onClick={SearchFunction}
          className="w-1/12 rounded-r-full  shadow-black shadow flex items-center justify-center active:bg-primary active:text-white"
        >
          <Search size={28} />
        </div>
      </form>
    </section>
  );
}
