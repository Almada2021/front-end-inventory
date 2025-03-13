import { useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
interface Props<T> {
  mutateFunction: (query: string) => Promise<T[] | undefined>;
  mutationKey?: string[];
  onGetData?: (data: T[] | undefined) => void;
  onNotify?: (query: string) => void;
  mode?: "min" | "max";
  placeholder?: string;
}
export default function SearchBar<T>({
  mutateFunction,
  mutationKey = ["random", "search"],
  onGetData,
  onNotify = (query: string) => {
    console.log(query);
  },
  mode = "max",
  placeholder = "Ingresa el nombre del proveedor",
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
  const memoizedNotify = useCallback(
    (query: string) => {
      onNotify(query);
    },
    [onNotify]
  );
  useEffect(() => {
    memoizedNotify(query);
  }, [query, memoizedNotify]);
  return (
    <section
      aria-description="Search bar"
      className={` ${
        mode == "max" && "min-h-[120px] max-h-[140px] p-20"
      }  flex justify-center items-center  w-full`}
    >
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          await SearchFunction();
        }}
        className={`bg-white w-full md:w-10/12 rounded-full ${
          mode == "max" && "h-[60px]"
        } flex`}
      >
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
          }}
          type="text"
          className={`bg-white w-full md:w-11/12 rounded-l-full ${
            mode == "max" && "h-[60px]"
          }  focus:outline-none px-4 shadow-black shadow `}
          aria-label="Buscar"
          title="Barra de Busqueda"
          placeholder={placeholder}
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
