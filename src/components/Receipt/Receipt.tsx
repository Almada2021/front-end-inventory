import { useReactToPrint } from "react-to-print";
import { useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CrossIcon } from "lucide-react";
import useUserById from "@/hooks/users/useUserById";
import useStoreByTillId from "@/hooks/store/useStoreByTillId";
import { TRANSLATE_PAYMENT_METHODS } from "@/constants/translations/payments.methods";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { useClientById } from "@/hooks/clients/useClientById";

type PaymentMethod = keyof typeof TRANSLATE_PAYMENT_METHODS;
const PaymentMethods: PaymentMethod[] = ["cash", "card", "transfer"];
interface ReceiptProps {
  data: {
    id: string;
    amount: number;
    profits: number;
    sellerId: string;
    products: Array<{
      product: string;
      quantity: number;
      _id: string;
    }>;
    till: string;
    bills: Record<string, number>;
    billsCashBack: Record<string, number>;
    createdAt: string;
    paymentMethod?: string;
    client?: string;
  };
}

export const Receipt = ({ data }: ReceiptProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { userByIdQuery } = useUserById(data.sellerId);
  const { storeByTillId } = useStoreByTillId(data.till);
  const {clientByIdQuery} = useClientById(data.client || "")
  // memoized Paid by customer
  const paidByCustomer = useMemo(() => {
    return Object.entries(data.bills).reduce(
      (acc, [key, value]) => acc + Number(key) * value,
      0
    );
  }, [data.bills]);
  const [, setSelectedMethod] = useState(data.paymentMethod?.[0] || "");

  const cashBack: Record<string, number> = data.billsCashBack;

  const bills: Record<string, number> = data.bills;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: "@page { size: auto; margin: 0mm; }",
  });

 

  if (userByIdQuery.isFetching || storeByTillId.isFetching) return null;

  return (
    <div className="h-full w-full bg-white p-8 flex flex-col">
      <div
        ref={componentRef}
        className="flex-1 bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Encabezado */}
        <div className="mb-6 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold text-center">
            {storeByTillId.data?.name || "Mi Negocio"}
          </h1>

          <div className="text-center mt-2">
            <p className="text-sm">{storeByTillId.data?.address || ""}</p>
            <p className="text-sm">
              {format(new Date(data.createdAt), "dd MMM yyyy HH:mm", {
                locale: es,
              })}
            </p>
            <p className="text-sm">Vendedor: {userByIdQuery.data?.name}</p>
            <p className="text-sm">Cliente:{" "} {clientByIdQuery.data ? `${clientByIdQuery.data?.name + " " + clientByIdQuery.data?.lastName}` :"N/A" }</p>
          </div>
        </div>

        {/* Productos */}
        <div className="mb-4">
          {data.products.map((product, index) => (
            <div key={product._id} className="flex justify-between mb-2">
              <span>Producto {index + 1}</span>
              <div className="text-right">
                <p>Cantidad: {product.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="my-6 border-t-2 border-black pt-4">
          {data.paymentMethod != "cash" && (
            <div className="flex justify-between mb-2">
              <span>Pagado:</span>
              <span>{formatCurrency(paidByCustomer)}</span>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <span>Total:</span>
            <span>{formatCurrency(data.amount)}</span>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="mt-8 border-t-2 border-dashed pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span>Método de pago:</span>
            <select
              title="Método de pago"
              value={data.paymentMethod}
              disabled={true}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="border rounded px-2"
            >
              {PaymentMethods.map((method) => (
                <option key={method} value={method}>
                  {TRANSLATE_PAYMENT_METHODS[method]}
                </option>
              ))}
            </select>
          </div>

          {bills && Object.keys(bills).length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <span>Billetes Pagados:</span>
              {Object.entries(bills).map(([bill, quantity]) => (
                <div
                  key={bill}
                  className="bg-gray-100 px-2 py-1 rounded flex items-center"
                >
                  {quantity}x {formatCurrency(Number(bill))}
                  <button
                    title="x"
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <CrossIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {cashBack && Object.keys(cashBack).length > 0 && (
            <div className="flex items-center gap-2">
              <span>Vuelto:</span>
              {Object.entries(cashBack).map(([bill, quantity]) => (
                <div
                  key={bill}
                  className="bg-gray-100 px-2 py-1 rounded flex items-center"
                >
                  {quantity}x {formatCurrency(Number(bill))}
                  <button
                    title="x"
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <CrossIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie de página */}
        <div className="mt-8 text-center text-sm">
          <p>¡Gracias por su compra!</p>
          <p>ID Recibo: {data.id}</p>
        </div>
      </div>

      <button
        onClick={() => {
          handlePrint();
        }}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 self-center print:hidden"
      >
        Imprimir Recibo
      </button>
    </div>
  );
};
