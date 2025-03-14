import { Client } from "@/infrastructure/interfaces/clients/clients.response";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

interface Props {
  client: Client;
  variant?: "detail" | "checkout";
  onClick?: () => void;
}

export default function CustomerCard({
  client,
  variant = "detail",
  onClick,
}: Props) {
  const navigate = useNavigate();
  const pressCard = () => {
    if (variant === "checkout" && onClick) {
      onClick();
    } else if (variant !== "checkout") {
      navigate(`../${client.id}`);
    }
  };

  return (
    <div
      onClick={pressCard}
      className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="p-6 flex flex-col flex-grow">
        {/* Header with Avatar, Name, and RUC */}
        <div className="flex items-center mb-4">
          <div className="bg-primary text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mr-4">
            {client.name.charAt(0)}
            {client.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {client.name} {client.lastName}
            </h3>
            <span className="text-sm text-gray-600">RUC: {client.ruc}</span>
          </div>
        </div>

        {/* Total Sales Moved Up */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            Compras realizadas: {client.salesHistory.length}
          </span>
        </div>

        {/* Address */}
        <p className="text-gray-700 mb-4 flex-grow">{client.address}</p>

        {/* Full-width Action Button */}
        <div className="mt-auto">
          {variant === "checkout" ? (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium
                flex items-center justify-center gap-1.5 hover:bg-green-600 transition-colors"
            >
              Seleccionar
            </motion.button>
          ) : (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`../${client.id}`);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium
                flex items-center justify-center gap-1.5 hover:bg-primary-dark transition-colors"
            >
              <InfoIcon className="h-5 w-5" />
              Ver Detalles
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
