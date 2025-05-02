import { useEffect, useState } from "react";
import useOrder from "@/hooks/order/useOrder";
import useProductsByIds from "@/hooks/products/useProductsByIds";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { useParams } from "react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  StatusTranslations,
  type OrderStatus,
} from "@/infrastructure/interfaces/order/order.interface";
import toast from "react-hot-toast";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Separator from "@radix-ui/react-separator";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import useStoreById from "@/hooks/store/useStoreById";
import useProvider from "@/hooks/providers/useProvider";
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
// import { BackendApi } from "@/core/api/api";

// Info
const StoreInfo = ({ storeId }: { storeId: string }) => {
  const { storeById } = useStoreById(storeId);

  if (storeById.isLoading) {
    return (
      <div>
        <p className="text-sm text-gray-500">Tienda</p>
        <p className="font-medium">Cargando...</p>
      </div>
    );
  }

  if (storeById.isError) {
    return (
      <div>
        <p className="text-sm text-gray-500">Tienda</p>
        <p className="font-medium text-red-500">Error al cargar tienda</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500">Tienda</p>
      <p className="font-medium">{storeById.data?.name || "N/A"}</p>
    </div>
  );
};
const SupplierInfo = ({ supplierId }: { supplierId: string }) => {
  const { getProviderById } = useProvider(supplierId);

  if (getProviderById.isLoading) {
    return (
      <div>
        <p className="text-sm text-gray-500">Proveedor</p>
        <p className="font-medium">Cargando...</p>
      </div>
    );
  }

  if (getProviderById.isError) {
    return (
      <div>
        <p className="text-sm text-gray-500">Proveedor</p>
        <p className="font-medium text-red-500">Error al cargar proveedor</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500">Proveedor</p>
      <p className="font-medium">{getProviderById.data?.name || "N/A"}</p>
    </div>
  );
};

// Product item component for partial order
const ProductItem = ({
  product,
  quantity,
  received = 0,
  isReceived = false,
  notes = "",
  onUpdate,
}: {
  product: {
    id: string;
    name?: string;
    photoUrl?: string;
    barCode?: string;
  };
  quantity: number;
  received?: number;
  isReceived?: boolean;
  notes?: string;
  onUpdate: (data: {
    received: number;
    isReceived: boolean;
    notes: string;
  }) => void;
}) => {
  const [localReceived, setLocalReceived] = useState(received);
  const [localIsReceived, setLocalIsReceived] = useState(isReceived);
  const [localNotes, setLocalNotes] = useState(notes);
  const [error, setError] = useState<string | null>(null);

  // Update local state when props change
  useEffect(() => {
    setLocalReceived(received);
    setLocalIsReceived(isReceived);
    setLocalNotes(notes);
  }, [received, isReceived, notes]);

  // Validate and update the received quantity
  const handleReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;

    // Validate the input
    if (value > quantity) {
      setError(
        `La cantidad recibida no puede ser mayor que la cantidad solicitada (${quantity})`
      );
      setLocalReceived(quantity);
      onUpdate({
        received: quantity,
        isReceived: localIsReceived,
        notes: localNotes,
      });
      return;
    }

    setError(null);
    setLocalReceived(value);

    // If quantity is 0 and product is marked as received, uncheck it
    if (value === 0 && localIsReceived) {
      setLocalIsReceived(false);
      onUpdate({ received: value, isReceived: false, notes: localNotes });
    } else {
      onUpdate({
        received: value,
        isReceived: localIsReceived,
        notes: localNotes,
      });
    }
  };

  // Handle checkbox change for received status
  const handleIsReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;

    // If marking as received and quantity is 0, set to full quantity
    if (value && localReceived === 0) {
      setLocalReceived(quantity);
      setLocalIsReceived(true);
      onUpdate({ received: quantity, isReceived: true, notes: localNotes });
      return;
    }

    // If unchecking received status, keep the current received quantity
    setLocalIsReceived(value);
    onUpdate({ received: localReceived, isReceived: value, notes: localNotes });
  };

  // Handle label click for received status
  const handleLabelClick = () => {
    const newValue = !localIsReceived;

    // If marking as received and quantity is 0, set to full quantity
    if (newValue && localReceived === 0) {
      setLocalReceived(quantity);
      setLocalIsReceived(true);
      onUpdate({ received: quantity, isReceived: true, notes: localNotes });
      return;
    }

    // If unchecking received status, keep the current received quantity
    setLocalIsReceived(newValue);
    onUpdate({
      received: localReceived,
      isReceived: newValue,
      notes: localNotes,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalNotes(value);
    onUpdate({
      received: localReceived,
      isReceived: localIsReceived,
      notes: value,
    });
  };

  // Determine the status of the product
  const getProductStatus = () => {
    if (localIsReceived) return "Recibido";
    if (localReceived > 0 && localReceived < quantity)
      return "Parcialmente recibido";
    if (localReceived === 0) return "Pendiente";
    return "Recibido";
  };

  return (
    <div className="border rounded-md p-4 mb-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden mr-3">
            {product.photoUrl ? (
              <img
                src={
                  product.photoUrl.startsWith("http")
                    ? product.photoUrl
                    : `${import.meta.env.VITE_BACKEND_URL}/static/${
                        product.photoUrl
                      }`
                }
                alt={product.name || "Producto"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                Sin imagen
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {product.name || "Producto sin nombre"}
            </div>
            <div className="text-xs text-gray-500">
              {product.barCode || "N/A"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">Cantidad: {quantity}</div>
          <div
            className={`text-xs font-medium ${
              getProductStatus() === "Recibido"
                ? "text-green-600"
                : getProductStatus() === "Parcialmente recibido"
                ? "text-yellow-600"
                : "text-gray-500"
            }`}
          >
            {getProductStatus()}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recibido
          </label>
          <input
            aria-label="Recibido"
            type="number"
            min="0"
            max={quantity}
            value={localReceived}
            onChange={handleReceivedChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id={`received-${product.id}`}
            checked={localIsReceived}
            onChange={handleIsReceivedChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor={`received-${product.id}`}
            onClick={handleLabelClick}
            className="ml-2 block text-sm text-gray-700 cursor-pointer"
          >
            Producto recibido
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            value={localNotes}
            onChange={handleNotesChange}
            placeholder="Agregar notas..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={1}
          />
        </div>
      </div>
    </div>
  );
};

export default function OrderInfo() {
  const { id } = useParams();
  const { orderByIdQuery } = useOrder(id!);
  const [productIdsToFetch, setProductIdsToFetch] = useState<string[]>([]);
  const { getProductsByIds } = useProductsByIds(productIdsToFetch);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [partialData, setPartialData] = useState<{
    products: Array<{
      productId: string;
      received: number;
      isReceived: boolean;
      notes: string;
    }>;
    description: string;
  }>({
    products: [],
    description: "",
  });
  const [partialDescription, setPartialDescription] = useState("");

  const mutateStatus = useMutation({
    mutationFn: async (status: OrderStatus) => {
      if (orderByIdQuery.data?.order.id) {
        if (status === "partially") {
          await BackendApi.patch(
            `/order/status/${orderByIdQuery.data.order.id}`,
            {
              status: status,
              partialData: partialData,
            }
          );
        } else {
          await BackendApi.patch(
            `/order/status/${orderByIdQuery.data.order.id}`,
            {
              status: status,
            }
          );
        }
      } else {
        throw new Error("Order ID is missing");
      }
    },
    onSuccess: () => {
      orderByIdQuery.refetch();
    },
    mutationKey: ["order", orderByIdQuery.data?.order.id],
    onError: (error: Error) => {
      console.error("Error updating order:", error);
    },
  });

  // Actualizar IDs de productos cuando los datos de la orden estén disponibles
  useEffect(() => {
    console.log("exec");
    const ids =
      orderByIdQuery.data?.order.products?.map((item) => item.product.id) || [];
    console.log(orderByIdQuery.data?.order);
    console.log(ids);
    if (orderByIdQuery.data?.order.products) {
      try {
        if (ids.length > 0) {
          setProductIdsToFetch(ids);
        } else {
          console.warn(
            "No se encontraron IDs de productos válidos en la orden"
          );
        }
      } catch (error) {
        console.error("Error al procesar los IDs de productos:", error);
      }
    }
  }, [orderByIdQuery.isSuccess, orderByIdQuery.data]);

  // Initialize partial data when order data is loaded
  useEffect(() => {
    if (orderByIdQuery.data?.order) {
      const order = orderByIdQuery.data.order;
      const initialPartialData = {
        products: order.products.map((item) => ({
          productId: item.product.id,
          received: item.received || 0,
          isReceived: item.isReceived || false,
          notes: item.notes || "",
        })),
        description: order.partialDescription || "",
      };
      setPartialData(initialPartialData);
      setPartialDescription(order.partialDescription || "");
    }
  }, [orderByIdQuery.data]);

  if (orderByIdQuery.isFetching) return <LoadingScreen />;

  if (orderByIdQuery.isError) {
    toast.error("Error al cargar el pedido");
    return (
      <div className="mt-20 md:mt-4 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">
              Error al cargar el pedido
            </h2>
            <p className="mt-2">
              No se pudo obtener la información del pedido. Por favor, intente
              nuevamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const order = orderByIdQuery.data?.order;

  if (!order) {
    return (
      <div className="mt-20 md:mt-4 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
          <div className="text-center">
            <h2 className="text-lg font-semibold">No se encontró el pedido</h2>
          </div>
        </div>
      </div>
    );
  }

  const products = getProductsByIds.data || [];
  const orderDate = order.date ? new Date(order.date) : new Date();
  const isLoadingProducts =
    getProductsByIds.isFetching && productIdsToFetch.length > 0;

  // Función para determinar el estado de un producto
  const getProductStatus = (productItem: {
    isReceived?: boolean;
    received?: number;
    quantity: number;
  }) => {
    if (productItem.isReceived) return "Recibido";
    if (
      productItem.received &&
      productItem.received > 0 &&
      productItem.received < productItem.quantity
    )
      return "Parcialmente recibido";
    if (!productItem.received || productItem.received === 0) return "Pendiente";
    return "Recibido";
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recibido":
        return "bg-green-100 text-green-800";
      case "Parcialmente recibido":
        return "bg-yellow-100 text-yellow-800";
      case "Pendiente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "partially":
        return "bg-yellow-100 text-yellow-800";
      case "returned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      if (newStatus === "partially") {
        // Update partial data with description
        setPartialData((prev) => ({
          ...prev,
          description: partialDescription,
        }));
      }

      await mutateStatus.mutate(newStatus);
      toast.success(`Estado actualizado a: ${StatusTranslations[newStatus]}`);
    } catch (error) {
      toast.error("Error al actualizar el estado del pedido");
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleProductUpdate = (
    productId: string,
    data: { received: number; isReceived: boolean; notes: string }
  ) => {
    setPartialData((prev) => {
      const updatedProducts = prev.products.map((p) =>
        p.productId === productId ? { ...p, ...data } : p
      );
      return { ...prev, products: updatedProducts };
    });
  };

  return (
    <div className="mt-20 md:mt-4 space-y-6 w-full">
      {/* Cabecera del pedido */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold">Pedido: {order.name}</h2>
            <span
              className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(
                order.status
              )}`}
            >
              {StatusTranslations[order.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">ID del Pedido</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium">
                {format(orderDate, "PPP", { locale: es })}
              </p>
            </div>

            <StoreInfo storeId={order.storeId} />
            <SupplierInfo supplierId={order.providerId} />
          </div>

          <Separator.Root className="h-px bg-gray-200 my-6" />

          {/* Lista de productos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Productos en este pedido
            </h3>

            {isLoadingProducts ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Cargando productos...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Imagen
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Producto
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código de Barras
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cantidad
                      </th>
                      {order.status === "partially" && (
                        <>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Recibido
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Estado
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.products && order.products.length > 0 ? (
                      order.products.map((productItem) => {
                        const productDetails = products.find(
                          (p) => p.id === productItem.product.id
                        );
                        const productStatus = getProductStatus(productItem);
                        const statusColor = getStatusColor(productStatus);

                        return (
                          <tr
                            key={productItem.product.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                                {productDetails?.photoUrl ? (
                                  <img
                                    src={
                                      productDetails?.photoUrl.startsWith(
                                        "http"
                                      )
                                        ? productDetails?.photoUrl
                                        : `${
                                            import.meta.env.VITE_BACKEND_URL
                                          }/static/${productDetails?.photoUrl}`
                                    }
                                    alt={productDetails?.name || "Producto"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                    Sin imagen
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {productDetails?.name || "Producto sin nombre"}
                              </div>
                              {productDetails?.price && (
                                <div className="text-xs text-gray-500">
                                  {formatCurrency(productDetails.price)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {productDetails?.barCode || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {productItem.quantity}
                            </td>
                            {order.status === "partially" && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {productItem.received || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}
                                  >
                                    {productStatus}
                                  </span>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={order.status === "partially" ? 6 : 4}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No hay productos en este pedido
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Partial order description */}
          {order.status === "partially" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Descripción del pedido parcial
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-gray-700">
                  {order.partialDescription ||
                    "No hay descripción disponible para este pedido parcial."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap justify-end gap-3">
        {/* Botón de Completado - Solo visible para pedidos pendientes */}
        {order.status === "open" && (
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                disabled={updatingStatus}
              >
                Marcar como Completado
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <AlertDialog.Title className="text-lg font-medium">
                  Confirmar cambio de estado
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-gray-500">
                  ¿Estás seguro de que deseas marcar este pedido como
                  "Completado"? Esta acción no se puede deshacer.
                </AlertDialog.Description>
                <div className="mt-4 flex justify-end space-x-2">
                  <AlertDialog.Cancel asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Cancelar
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                      onClick={() => updateOrderStatus("closed")}
                    >
                      Confirmar
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        )}

        {/* Botón de Completado Parcial - Solo visible para pedidos pendientes */}
        {order.status === "open" && (
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                disabled={updatingStatus}
              >
                Completado Parcial
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
                <AlertDialog.Title className="text-lg font-medium">
                  Completar Parcialmente
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-gray-500">
                  Indica qué productos han sido recibidos y cuántos. Puedes
                  agregar notas para cada producto.
                </AlertDialog.Description>

                <div className="mt-4 max-h-96 overflow-y-auto">
                  {order.products.map((productItem) => {
                    const productDetails = products.find(
                      (p) => p.id === productItem.product.id
                    );

                    return (
                      <ProductItem
                        key={productItem.product.id}
                        product={productDetails || productItem.product}
                        quantity={productItem.quantity}
                        received={productItem.received || 0}
                        isReceived={productItem.isReceived || false}
                        notes={productItem.notes || ""}
                        onUpdate={(data) =>
                          handleProductUpdate(productItem.product.id, data)
                        }
                      />
                    );
                  })}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del pedido parcial
                  </label>
                  <textarea
                    value={partialDescription}
                    onChange={(e) => setPartialDescription(e.target.value)}
                    placeholder="Describe el estado del pedido parcial..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <AlertDialog.Cancel asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Cancelar
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                      onClick={() => updateOrderStatus("partially")}
                    >
                      Confirmar
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        )}

        {/* Botón de Cancelar - Solo visible para pedidos pendientes */}
        {order.status === "open" && (
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={updatingStatus}
              >
                Cancelar Pedido
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <AlertDialog.Title className="text-lg font-medium">
                  Cancelar Pedido
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-gray-500">
                  ¿Estás seguro de que deseas cancelar este pedido? Esta acción
                  no se puede deshacer.
                </AlertDialog.Description>
                <div className="mt-4 flex justify-end space-x-2">
                  <AlertDialog.Cancel asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Volver
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      onClick={() => updateOrderStatus("cancelled")}
                    >
                      Sí, Cancelar
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        )}

        {/* Botón de Devolver Pedido - Solo visible para pedidos completados o parcialmente completados */}
        {(order.status === "closed" || order.status === "partially") && (
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                className="px-4 mr-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                disabled={updatingStatus}
              >
                Devolver Pedido
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <AlertDialog.Title className="text-lg font-medium">
                  Devolver Pedido
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-gray-500">
                  ¿Estás seguro de que deseas marcar este pedido como
                  "Devuelto"? Esta acción cambiará el estado del pedido a
                  devolución.
                </AlertDialog.Description>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Al marcar este pedido como
                    devuelto, se restará el stock de los productos que fueron
                    recibidos anteriormente.
                    {order.status === "partially" ? (
                      <span className="block mt-1">
                        Como este pedido está parcialmente completado, solo se
                        restará el stock de los productos que fueron marcados
                        como recibidos.
                      </span>
                    ) : (
                      <span className="block mt-1">
                        Se restará el stock de todos los productos del pedido.
                      </span>
                    )}
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <AlertDialog.Cancel asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Cancelar
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                      onClick={() => updateOrderStatus("returned")}
                    >
                      Confirmar
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        )}
      </div>
    </div>
  );
}
