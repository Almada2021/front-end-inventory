import { useParams } from "react-router";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, Wallet, User, Repeat } from "lucide-react";
import LoadingScreen from "../Loading/LoadingScreen";
import useTransfertHistoryById from "@/hooks/transfert-history/useTransfertHistoryById";
import useUserById from "@/hooks/users/useUserById";
import { TRANSLATE_PAYMENT_METHODS } from "@/constants/translations/payments.methods";

export default function HistoryTransfert() {
  const { id } = useParams();
  const { getHistoryTransfertQuery } = useTransfertHistoryById(id!);
  const { data: transfert, isFetching } = getHistoryTransfertQuery;
  const { userByIdQuery } = useUserById(transfert?.user || "");

  const formatter = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
  });

  if (isFetching)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingScreen />
      </div>
    );

  if (!transfert) return <div>Transferencia no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full mt-10 md:mt-4">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-gray-100"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Repeat className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Transferencia #{transfert.id.slice(0, 8)}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Clock className="h-5 w-5 text-blue-500" />
              <p className="text-lg">
                {new Date(transfert.createdAt).toLocaleDateString("es-PY", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de métricas */}
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
                {formatter.format(transfert.amount)}
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
              <Repeat className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Método</h3>
              <p className="text-xl font-bold text-gray-800 capitalize">
                {
                  TRANSLATE_PAYMENT_METHODS[
                    transfert.method as keyof typeof TRANSLATE_PAYMENT_METHODS
                  ]
                }
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
              <h3 className="text-sm text-gray-500">Usuario</h3>
              <p className="text-xl font-bold text-gray-800 truncate">
                {userByIdQuery.data?.name || transfert.user}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de billetes */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Wallet className="h-6 w-6 text-orange-600" />
          Desglose de billetes
        </h2>

        <div className="flex flex-wrap gap-2">
          {Object.entries(transfert.bills).map(([denomination, count]) => (
            <Badge
              key={denomination}
              variant="outline"
              className="px-4 py-2 text-sm flex items-center gap-2"
            >
              <span className="font-semibold">
                {formatter.format(Number(denomination))}
              </span>
              <span className="text-gray-500">x {count}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Detalles adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Detalles de la transferencia
          </h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">ID de transacción:</span>{" "}
              {transfert.id}
            </p>
            <p className="text-sm">
              <span className="font-medium">Método:</span>{" "}
              <span className="capitalize">
                {
                  TRANSLATE_PAYMENT_METHODS[
                    transfert.method as keyof typeof TRANSLATE_PAYMENT_METHODS
                  ]
                }
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Información del usuario
          </h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Nombre:</span>{" "}
              {userByIdQuery.data?.name || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span>{" "}
              {userByIdQuery.data?.email || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
