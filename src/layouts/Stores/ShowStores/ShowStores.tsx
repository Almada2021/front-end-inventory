import { Button } from "@/components/ui/button";
import { useStores } from "@/hooks/store/useStores";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { motion } from "framer-motion";
import { PinIcon, StoreIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function ShowStores() {
  const { storesQuery } = useStores({ page: 1, limit: 200 });
  const navigate = useNavigate();
  const toStore = (id: string) => {
    navigate(`./${id}`);
  };
  if (storesQuery.isFetching)
    return (
      <div className="p-10 w-full flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
        <LoadingScreen />
      </div>
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 mt-10 md:mt-0">
      {storesQuery?.data?.map((store, index) => (
        <motion.div
          key={store.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative group max-h-[300px] min-w-[200px]"
        >
          <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200">
            {/* Encabezado con efecto decorativo */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-xl" />

            {/* Contenido principal */}
            <div className="space-y-4">
              {/* Nombre destacado */}
              <StoreIcon size={48} color="#00F" className="mx-auto" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center1">
                {store.name}
              </h3>

              {/* Dirección con icono */}
              <div className="flex items-center gap-2 text-gray-600">
                <PinIcon size={24} color="#03C" />
                <p className="text-sm">
                  {store.address.substring(0, 45)}
                  {store.address.length > 45 && "..."}
                </p>
              </div>

              {/* Detalles adicionales */}
              <div className="flex flex-col gap-2 justify-between text-xs text-gray-500 mt-4">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Empleados:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {store.employeesIds.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Cajas:</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {store.tillIds.length}
                  </span>
                </div>
                <Button onClick={() => toStore(store.id)}>Ir</Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
