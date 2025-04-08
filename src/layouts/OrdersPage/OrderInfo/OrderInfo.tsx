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
      <p className="font-medium">{storeById.data?.name || 'N/A'}</p>
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
      <p className="font-medium">{getProviderById.data?.name || 'N/A'}</p>
    </div>
  );
};

export default function OrderInfo() {
  const { id } = useParams();
  const { orderByIdQuery } = useOrder(id!);
  const [productIdsToFetch, setProductIdsToFetch] = useState<string[]>([]);
  const { getProductsByIds } = useProductsByIds(productIdsToFetch);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const mutateStatus = useMutation({
    mutationFn: async (status: OrderStatus) => {
      if(orderByIdQuery.data?.order.id){
        await BackendApi.patch(`/order/status/${orderByIdQuery.data.order.id}`,{
          status: status,
        })

      }else{
        throw new Error("Order ID is missing");
      }
    },
    onSuccess: () => {
      orderByIdQuery.refetch();
    },
    mutationKey: ["order", orderByIdQuery.data?.order.id],
    onError: (error: Error) => {
        console.error("Error updating order:", error);
    }
  })
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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "partially":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      // Aquí iría la llamada a la API para actualizar el estado
      // await BackendApi.put(`/orders/${id}/status`, { status: newStatus });
      await mutateStatus.mutate(newStatus)
      toast.success(`Estado actualizado a: ${StatusTranslations[newStatus]}`);
    } catch (error) {
      toast.error("Error al actualizar el estado del pedido");
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="mt-20 md:mt-4 space-y-6 w-full">
      {/* Cabecera del pedido */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold">Pedido: {order.name}</h2>
            <span
              className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.products && order.products.length > 0 ? (
                      order.products.map((productItem) => {
                        const productDetails = products.find(
                          (p) => p.id === productItem.product.id
                        );
                        return (
                          <tr
                            key={productItem.product.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                                {productDetails?.photoUrl ? (
                                  <img
                                    src={productDetails?.photoUrl}
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
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
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
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap justify-end gap-3">
        {order.status !== "closed" && (
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

        {order.status !== "partially" && order.status !== "closed" && (
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
              <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <AlertDialog.Title className="text-lg font-medium">
                  Completar Parcialmente
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-gray-500">
                  ¿Estás seguro de que deseas marcar este pedido como
                  "Parcialmente completado"? Esta acción no se puede deshacer.
                </AlertDialog.Description>
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

        {order.status !== "cancelled" && order.status !== "closed" && (
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
      </div>
    </div>
  );
}
