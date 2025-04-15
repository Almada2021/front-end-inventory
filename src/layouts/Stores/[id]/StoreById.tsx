import useStoreById from "@/hooks/store/useStoreById";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { Building, MapPin, Wallet, Package } from "lucide-react";
import { motion } from "framer-motion";

import { useNavigate, useParams } from "react-router";
import useTills from "@/hooks/till/useTills";
import { Till } from "@/infrastructure/interfaces/till.interface";
import { TillCard } from "@/components/Cards/Till/TillCard";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import useOrders from "@/hooks/order/useOrders";
import { useAdmin } from "@/hooks/browser/useAdmin";

export default function StoreById() {
  const { id } = useParams();
  const isAdmin = useAdmin();
  const { storeById } = useStoreById(id || "");
  const { data: store } = storeById;
  const {getOrdersQuery} = useOrders({
    page: 1,
    limit: 1000,
    status: "open"
  })
  const navigate = useNavigate();
  const { tillsByStoreQuery } = useTills(id!);
  if(!isAdmin){
    navigate("/inventory")
    return null;
  }
  if (storeById.isFetching || tillsByStoreQuery.isFetching)
    return <LoadingScreen />;
  if (!store) return <div>No Encontrado</div>;
  const tills = tillsByStoreQuery.data?.tills;
  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      {/* Encabezado de la tienda */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-gray-100"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Building className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{store.name}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MapPin className="h-5 w-5 text-red-500" />
              <p className="text-lg">{store.address}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-md border-2 border-green-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total en cajas</h3>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(
                  tillsByStoreQuery.data?.tills.reduce(
                    (acc, till) => acc + till.totalCash,
                    0
                  ) || 0
                )}{" "}
                Gs
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Pedidos pendientes</h3>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(getOrdersQuery.data?.orders.reduce((acc, order) => acc + order.amount,0) || 0)}</p>
            </div>
          </div>
        </motion.div>

        {/* Agregar más tarjetas de métricas según sea necesario */}
      </div>

      {/* Sección de Cajas Registradoras */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Wallet className="h-6 w-6 text-green-600" />
          Cajas Registradoras
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              onClick={() => {
                navigate(`../new-till/${id}`);
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "group relative h-[200px] rounded-xl bg-gradient-to-br from-green-50 to-blue-50 p-6 shadow-lg",
                "border-2 border-transparent hover:border-green-200 transition-all duration-300"
              )}
            >
              {/* Barra de estado superior */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 rounded-t-xl   bg-green-400}`}
              />

              {/* Icono de Lucide */}
              <div className="flex justify-center mb-4">
                <Wallet className="h-12 w-12 text-green-600 stroke-[1.5]" />
              </div>

              {/* Contenido */}
              <div className="space-y-3 text-center">
                <h3 className="text-xl font-bold text-gray-800 truncate">+</h3>

                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Fondo actual</span>
                  <p className="text-2xl font-bold text-green-700">
                    Agregar Caja Registradora
                  </p>
                </div>

                {/* Badge de estado */}
                <span
                  className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium 
                      bg-green-100 text-green-800
                  `}
                ></span>
              </div>
            </motion.div>
          </motion.div>
          {tills?.map((till: Till, index: number) => (
            <motion.div
              onClick={() => {
                navigate(`../../till/${till.id}`);
              }}
              key={till.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TillCard
                type={till.type}
                status={till.status}
                name={till.name}
                currentMoney={Number(till.totalCash) || 0}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Espacio para futuras secciones */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Próximas integraciones
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Estadísticas de ventas</h3>
            <p className="text-sm">Disponible próximamente</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Reportes diarios</h3>
            <p className="text-sm">En desarrollo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
