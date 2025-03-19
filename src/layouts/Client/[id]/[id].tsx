import useClient from "@/hooks/clients/useClient";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { useParams } from "react-router";
import { Pencil, User, IdCard, Home, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ClientsForm from "@/components/forms/clients-form";
import { Button } from "@/components/ui/button";

export default function ClientIdPage() {
  const { id } = useParams();
  const { getClientQuery } = useClient(String(id), 1);
  const [editMode, setEditMode] = useState(false);
  if (getClientQuery.isFetching) return <LoadingScreen />;
  const client = getClientQuery.data?.clients[0];

  if (!client) return <div>Cliente no encontrado</div>;
  if (editMode)
    return (
      <div className="w-full mt-20 md:mt-4 flex flex-col gap-2">
        <div>

        <Button
          onClick={() => { setEditMode(false)}}
        >
          Volver
        </Button>
        </div>
        <ClientsForm
          onEdit={() => {
           
            setEditMode(false)
            window.location.reload();
          }} 
          edit={true}
          valuesEdited={client}
        />
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      {/* Encabezado del cliente */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-gray-100"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <User className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {client.name} {client.lastName}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <IdCard className="h-5 w-5 text-blue-500" />
                  <p className="text-lg">{client.ruc || "Sin RUC"}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditMode(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Editar cliente"
              >
                <Pencil className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Dirección</h3>
              <p className="text-lg font-medium text-gray-800">
                {client.address || "-"}
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
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Historial de compras</h3>
              <p className="text-lg font-medium text-gray-800">
                {client.salesHistory.length || "0"} transacciones
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de detalles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <IdCard className="h-6 w-6 text-blue-600" />
          Detalles completos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <DetailItem
            label="ID del cliente"
            value={client.id}
            icon={<IdCard className="h-5 w-5 text-gray-500" />}
          />
          <DetailItem
            label="Última compra"
            value={client.salesHistory[0] || "No registrada"}
            icon={<ClipboardList className="h-5 w-5 text-gray-500" />}
          />
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-4 bg-gray-50 rounded-lg transition-colors",
        "hover:bg-gray-100 group"
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-gray-400 group-hover:text-gray-500">{icon}</div>
        )}
        <div className="space-y-1">
          <dt className="text-xs font-medium text-gray-500 uppercase">
            {label}
          </dt>
          <dd className="text-base text-gray-900 font-medium break-words">
            {value || "-"}
          </dd>
        </div>
      </div>
    </div>
  );
}
// ... rest of code remains same
