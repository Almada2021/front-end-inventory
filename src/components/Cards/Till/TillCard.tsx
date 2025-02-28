import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react"; // Icono de Lucide

interface TillCardProps {
  name: string;
  currentMoney: number;
  status: boolean;
  className?: string;
}

export function TillCard({
  name = "Caja Error",
  currentMoney = 0,
  status = false,
  className,
}: TillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group relative h-[200px] rounded-xl bg-gradient-to-br from-green-50 to-blue-50 p-6 shadow-lg",
        `border-2 border-transparent ${
          status ? "hover:border-green-200" : "hover:border-red-400"
        } transition-all duration-300`,
        className
      )}
    >
      {/* Barra de estado superior */}
      <div
        className={`absolute top-0 left-0 right-0 h-2 rounded-t-xl ${
          status ? "bg-green-400" : "bg-red-400"
        }`}
      />

      {/* Icono de Lucide */}
      <div className="flex justify-center mb-4">
        <Wallet className="h-12 w-12 text-green-600 stroke-[1.5]" />
      </div>

      {/* Contenido */}
      <div className="space-y-3 text-center">
        <h3 className="text-xl font-bold text-gray-800 truncate">{name}</h3>

        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Fondo actual</span>
          <p className="text-2xl font-bold text-green-700">
            {currentMoney.toLocaleString()} Gs
          </p>
        </div>

        {/* Badge de estado */}
        <span
          className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
            status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {status ? "Abierta" : "Cerrada"}
        </span>
      </div>
    </motion.div>
  );
}
