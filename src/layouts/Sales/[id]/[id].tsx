import useSaleById from "@/hooks/sales/useSaleById";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Wallet,
  User,
  Package,
  CheckCircle,
  ArrowDownNarrowWide,
} from "lucide-react";
import { Receipt } from "@/components/Receipt/Receipt";
import useClient from "@/hooks/clients/useClient";
import useUserById from "@/hooks/users/useUserById";
import BadgeList from "../BadgeList/BadgeList";
import { Button } from "@/components/ui/button";

export default function SalesById() {
  const { id } = useParams();
  const { salesByIdQuery } = useSaleById(id!);
  const { getClientQuery } = useClient(salesByIdQuery.data?.client, 1);
  const { userByIdQuery } = useUserById(salesByIdQuery?.data?.sellerId || "");

  if (!id) return null;
  if (salesByIdQuery.isFetching) return <LoadingScreen />;

  const saleData = salesByIdQuery.data;
  if (!saleData) return <div>Venta no encontrada</div>;

  const formatter = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full mt-10 md:mt-4">
      {/* Encabezado de la venta */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-gray-100"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Venta #{saleData.id.slice(0, 8)}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Clock className="h-5 w-5 text-blue-500" />
              <p className="text-lg">
                {new Date(saleData.createdAt).toLocaleDateString("es-PY", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button size="lg">
              <ArrowDownNarrowWide className="w-4 h-4" />
              Revertir Movimiento
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Monto total</h3>
              <p className="text-2xl font-bold text-gray-800">
                {formatter.format(saleData.amount)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-md border-2 border-green-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Ganancias</h3>
              <p className="text-2xl font-bold text-gray-800">
                {formatter.format(saleData.profits)}
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
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Cliente</h3>
              <p className="text-xl font-bold text-gray-800 truncate">
                {getClientQuery.data?.clients?.[0]?.name ||
                  saleData.client ||
                  "Desconocido"}{" "}
                {getClientQuery.data?.clients?.[0]?.lastName}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de Productos */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="h-6 w-6 text-orange-600" />
          Productos vendidos ({saleData.products.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BadgeList products={saleData.products} />
        </div>
      </div>

      {/* Detalles adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Método de pago
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {saleData.paymentMethod === "cash" ? "Efectivo" : "Tarjeta"}
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Detalles de facturación
          </h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Número de factura:</span>{" "}
              {saleData.till}
            </p>
            <p className="text-sm">
              <span className="font-medium">Vendedor:</span>{" "}
              {userByIdQuery.data?.name || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="max-h-[400px]">
        <Receipt data={saleData} />
      </div>
    </div>
  );
}
