import { Receipt } from "@/components/Receipt/Receipt";
import { Sale } from "@/infrastructure/interfaces/sale/sale.interface";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  confirmFn: () => void;
  lastSale: Sale | null;
}

const ConfirmScreen = ({ confirmFn, lastSale = null }: Props) => {
  if (lastSale) {
    return (
      <div>
        <Receipt data={lastSale} />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          ¿Confirmar venta?
        </h2>

        <div className="flex justify-center gap-4">
          {/* Botón de Cancelar */}
          <button className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
            <XCircle className="w-6 h-6" />
            <span className="font-semibold">Cancelar</span>
          </button>

          {/* Botón de Confirmar */}
          <button
            onClick={confirmFn}
            className="flex items-center gap-2 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Confirmar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmScreen;
