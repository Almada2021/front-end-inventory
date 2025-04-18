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
import useRevertSale from "@/hooks/sales/useRevertSale";
import useModifySale from "@/hooks/sales/useModifySale";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreateSaleDto } from "@/infrastructure/interfaces/sale/sale.interface";
import useProductsByIds from "@/hooks/products/useProductsByIds";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapBills } from "@/lib/shared/bills.mapper-dto";

export default function SalesById() {
  const { id } = useParams();
  const { salesByIdQuery } = useSaleById(id!);
  const { getClientQuery } = useClient(salesByIdQuery.data?.client, 1);
  const { userByIdQuery } = useUserById(salesByIdQuery?.data?.sellerId || "");
  const { revertSaleMutation } = useRevertSale();
  const { modifySaleMutation } = useModifySale();

  // Separar estados para edición y eliminación
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<string | null>(null);
  const [editProductQuantity, setEditProductQuantity] = useState<number>(0);
  const [editBills, setEditBills] = useState<Record<string, number>>({});
  const [editBillsCashBack, setEditBillsCashBack] = useState<
    Record<string, number>
  >({});
  const [activeTab, setActiveTab] = useState<string>("products");

  // Obtener los IDs de los productos de la venta
  const productIds = salesByIdQuery.data?.products.map((p) => p.product) || [];
  const { getProductsByIds } = useProductsByIds(productIds);

  if (!id) return null;
  if (salesByIdQuery.isFetching)
    return (
      <div className="flex w-full px-10 justify-center items-center h-screen">
        <LoadingScreen />
      </div>
    );

  const saleData = salesByIdQuery.data;
  if (!saleData) return <div>Venta no encontrada</div>;

  const formatter = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
  });

  const handleRevertSale = () => {
    revertSaleMutation.mutate(id);
  };

  const handleRemoveProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const handleEditProduct = (productId: string) => {
    const product = saleData.products.find((p) => p.product === productId);
    if (product) {
      setProductToEdit(productId);
      setEditProductQuantity(product.quantity);
    }
  };

  const handleEditBills = () => {
    setEditBills(saleData.bills || {});
    setEditBillsCashBack(saleData.billsCashBack || {});
    setActiveTab("bills");
  };

  const confirmRemoveProduct = () => {
    if (!productToDelete || !saleData) return;

    const updatedProducts = saleData.products.filter(
      (product) => product.product !== productToDelete
    );

    const removedProduct = saleData.products.find(
      (product) => product.product === productToDelete
    );

    if (!removedProduct) return;

    const productDetails = getProductsByIds.data?.find(
      (p) => p.id === productToDelete
    );

    if (!productDetails) return;

    const removedAmount = productDetails.price * removedProduct.quantity;
    const removedProfits =
      (productDetails.price - productDetails.basePrice) *
      removedProduct.quantity;

    const newAmount = saleData.amount - removedAmount;
    const newProfits = saleData.profits - removedProfits;

    const modifiedSaleDto: CreateSaleDto = {
      amount: newAmount,
      profits: newProfits,
      sellerId: saleData.sellerId,
      products: updatedProducts,
      till: saleData.till,
      bills: saleData.bills,
      billsCashBack: saleData.billsCashBack,
      paymentMethod: saleData.paymentMethod,
      client: saleData.client,
    };

    modifySaleMutation.mutate({ id, dto: modifiedSaleDto });
    setProductToDelete(null);
  };

  const confirmEditProduct = () => {
    if (!productToEdit || !saleData || editProductQuantity <= 0) return;

    const productToModify = saleData.products.find(
      (product) => product.product === productToEdit
    );

    if (!productToModify) return;

    const productDetails = getProductsByIds.data?.find(
      (p) => p.id === productToEdit
    );

    if (!productDetails) return;

    const quantityDiff = editProductQuantity - productToModify.quantity;
    const amountDiff = productDetails.price * quantityDiff;
    const profitsDiff =
      (productDetails.price - productDetails.basePrice) * quantityDiff;

    const newAmount = saleData.amount + amountDiff;
    const newProfits = saleData.profits + profitsDiff;

    const updatedProducts = saleData.products.map((product) => {
      if (product.product === productToEdit) {
        return {
          ...product,
          quantity: editProductQuantity,
        };
      }
      return product;
    });

    const modifiedSaleDto: CreateSaleDto = {
      amount: newAmount,
      profits: newProfits,
      sellerId: saleData.sellerId,
      products: updatedProducts,
      till: saleData.till,
      bills: saleData.bills,
      billsCashBack: saleData.billsCashBack,
      paymentMethod: saleData.paymentMethod,
      client: saleData.client,
    };

    modifySaleMutation.mutate({ id, dto: modifiedSaleDto });
    setProductToEdit(null);
  };

  const confirmEditBills = () => {
    if (!saleData) return;

    // Create a DTO for the modified sale with updated bills
    const modifiedSaleDto: CreateSaleDto = {
      ...saleData,
      bills: editBills,
      billsCashBack: editBillsCashBack,
    };

    // Call the mutation to update the sale
    modifySaleMutation.mutate({ id, dto: modifiedSaleDto });
  };

  // Render bill input fields
  const renderBillInputs = (
    bills: Record<string, number>,
    setBills: React.Dispatch<React.SetStateAction<Record<string, number>>>
  ) => {
    return Object.entries(MapBills).map(([denomination, label]) => (
      <div key={denomination} className="grid grid-cols-2 items-center gap-4">
        <Label htmlFor={`bill-${denomination}`}>{label}</Label>
        <Input
          id={`bill-${denomination}`}
          type="number"
          min="0"
          value={bills[denomination] || 0}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setBills((prev) => ({
              ...prev,
              [denomination]: value,
            }));
          }}
        />
      </div>
    ));
  };

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  variant={saleData.reverted ? "default" : "destructive"}
                  disabled={saleData.reverted}
                >
                  <ArrowDownNarrowWide className="w-4 h-4 mr-2" />
                  {saleData.reverted ? "Revertido" : "Revertir Movimiento"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción revertirá la venta y restaurará el inventario.
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRevertSale}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-600" />
            Productos vendidos ({saleData.products.length})
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEditBills}
              disabled={saleData.reverted || saleData.paymentMethod !== "cash"}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Editar Billetes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BadgeList
            products={saleData.products}
            onRemoveProduct={handleRemoveProduct}
            onEditProduct={handleEditProduct}
            disabled={saleData.reverted}
          />
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

      {/* Dialog for editing product quantity */}
      <Dialog
        open={!!productToEdit}
        onOpenChange={() => setProductToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cantidad de producto</DialogTitle>
            <DialogDescription>
              Ingresa la nueva cantidad para este producto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={editProductQuantity}
                onChange={(e) =>
                  setEditProductQuantity(parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToEdit(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmEditProduct}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing bills */}
      <Dialog
        open={activeTab === "bills"}
        onOpenChange={() => setActiveTab("products")}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar billetes</DialogTitle>
            <DialogDescription>
              Modifica los billetes utilizados en esta venta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="bills">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bills">Billetes</TabsTrigger>
                <TabsTrigger value="cashback">Vuelto</TabsTrigger>
              </TabsList>
              <TabsContent value="bills" className="space-y-4">
                {renderBillInputs(editBills, setEditBills)}
              </TabsContent>
              <TabsContent value="cashback" className="space-y-4">
                {renderBillInputs(editBillsCashBack, setEditBillsCashBack)}
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveTab("products")}>
              Cancelar
            </Button>
            <Button onClick={confirmEditBills}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for removing products */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto de la venta. Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveProduct}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
