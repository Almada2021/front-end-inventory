import { useCallback, memo } from "react";
import LoadingScreen from "../Loading/LoadingScreen";
import useTills from "@/hooks/till/useTills";
import { Till } from "@/infrastructure/interfaces/till.interface";
import { motion } from "framer-motion";
import { TillCard } from "@/components/Cards/Till/TillCard";
interface Props {
  changeMode: (id: string, till: Till) => void;
  storeId: string;
}
const TillSelectorScreen = memo(function StoreSelectorScreen({
  changeMode,
  storeId,
}: Props) {
  const { tillsByStoreQuery } = useTills(storeId!, {
    type: "till",
  });

  const memoizedChangeMode = useCallback(
    (id: string, till: Till) => {
      changeMode(id, till);
    },
    [changeMode]
  );
  if (tillsByStoreQuery.isFetching)
    return (
      <div className="p-10 w-full h-screen flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
        <LoadingScreen />
      </div>
    );
  const tills = tillsByStoreQuery.data?.tills;
  return (
    <div className="p-10 mt-4 md:mt-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 col-span-full w-full gap-2 ">
      {tills?.map((till: Till, index: number) => (
        <motion.div
          onClick={() => {
            memoizedChangeMode(till.id, till);
          }}
          key={till.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TillCard
            status={till.status}
            name={till.name}
            type="till"
            currentMoney={Number(till.totalCash) || 0}
          />
        </motion.div>
      ))}
    </div>
  );
});

export default TillSelectorScreen;
