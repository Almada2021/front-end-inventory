import { useState, useMemo, useCallback } from "react";
import { useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useProviders } from "@/hooks/providers/useProviders";
import useProvider from "@/hooks/providers/useProvider";
import useProductsByIds from "@/hooks/products/useProductsByIds";
import { useStores } from "@/hooks/store/useStores";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { ProviderModel } from "@/infrastructure/interfaces/provider.interface";
import { Store } from "@/infrastructure/interfaces/store/store.interface";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import ComboBox from "@/components/ComboBox/ComboBox";
import useSearchProviders from "@/hooks/providers/useSearchProviders";
import useSearchProducts from "@/hooks/products/useSearchProducts";

// Componentes UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Search } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { useAdmin } from "@/hooks/browser/useAdmin";

// Interfaces para el formulario
interface OrderProduct {
  product: string;
  quantity: number;
}

interface OrderFormValues {
  name: string;
  providerId: string;
  products: OrderProduct[];
  storeId: string;
}

// Interfaces para los componentes
interface OrderNameFieldProps {
  formik: FormikProps<OrderFormValues>;
}

interface ProviderSelectProps {
  formik: FormikProps<OrderFormValues>;
  providers: ProviderModel[];
  onProviderChange: (value: string) => void;
  onSearch: (value: string) => void;
  isLoading: boolean;
}

interface StoreSelectProps {
  formik: FormikProps<OrderFormValues>;
  stores: Store[];
  onStoreChange: (value: string) => void;
}

interface ProductSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading: boolean;
}

interface ProductRowProps {
  index: number;
  formik: FormikProps<OrderFormValues>;
  availableProducts: Product[];
  onProductChange: (value: string, index: number) => void;
  onRemoveProduct: (index: number) => void;
  disableRemove: boolean;
  onSearch: (value: string) => void;
  isLoading: boolean;
}

interface OrderTotalProps {
  total: number;
}

// Componentes de UI
const FormHeader: React.FC = () => (
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl font-bold">Crear Nuevo Pedido</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Complete los detalles para crear un nuevo pedido para su tienda.
    </CardDescription>
  </CardHeader>
);

const OrderNameField: React.FC<OrderNameFieldProps> = ({ formik }) => (
  <div className="space-y-2">
    <Label htmlFor="name" className="text-sm font-medium">
      Nombre del Pedido
    </Label>
    <Input
      id="name"
      name="name"
      type="text"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.name}
      placeholder="Ingrese nombre del pedido"
      className={`h-10 px-3 py-2 text-sm ${
        formik.touched.name && formik.errors.name
          ? "border-destructive focus:ring-destructive"
          : ""
      }`}
    />
    {formik.touched.name && formik.errors.name && (
      <p className="text-sm text-destructive mt-1">{formik.errors.name}</p>
    )}
  </div>
);

const ProviderSelect: React.FC<ProviderSelectProps> = ({
  formik,
  providers,
  onProviderChange,
  onSearch,
  isLoading,
}) => {
  const providerOptions = providers.map((provider) => ({
    value: provider.id,
    label: provider.name,
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor="providerId" className="text-sm font-medium">
        Seleccionar Proveedor
      </Label>
      <ComboBox
        options={providerOptions}
        placeholder="Buscar proveedor..."
        onChange={onProviderChange}
        searchFn={onSearch}
        isLoading={isLoading}
        error={formik.touched.providerId ? formik.errors.providerId : undefined}
        className="w-full"
      />
      {formik.touched.providerId && formik.errors.providerId && (
        <p className="text-sm text-destructive mt-1">
          {formik.errors.providerId}
        </p>
      )}
    </div>
  );
};

const StoreSelect: React.FC<StoreSelectProps> = ({
  formik,
  stores,
  onStoreChange,
}) => {
  const storeOptions = stores.map((store) => ({
    value: store.id,
    label: store.name,
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor="storeId" className="text-sm font-medium">
        Seleccionar Tienda
      </Label>
      <ComboBox
        options={storeOptions}
        placeholder="Seleccione una tienda"
        onChange={onStoreChange}
        error={formik.touched.storeId ? formik.errors.storeId : undefined}
        className="w-full"
      />
      {formik.touched.storeId && formik.errors.storeId && (
        <p className="text-sm text-destructive mt-1">{formik.errors.storeId}</p>
      )}
    </div>
  );
};

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  setSearchTerm,
  isLoading,
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Buscar productos..."
      className="pl-9 h-10"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {isLoading && (
      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
    )}
  </div>
);

const ProductRow: React.FC<ProductRowProps> = ({
  index,
  formik,
  availableProducts,
  onProductChange,
  onRemoveProduct,
  disableRemove,
  onSearch,
  isLoading,
}) => {
  const productOptions = availableProducts.map((product) => ({
    value: product.id,
    label: product.name,
    img: product.photoUrl || undefined,
  }));

  return (
    <Card className="overflow-hidden border rounded-lg shadow-sm">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[3fr_1fr_auto] gap-4 items-end">
        <div className="space-y-2">
          <Label
            htmlFor={`products.${index}.product`}
            className="text-sm font-medium"
          >
            Producto
          </Label>
          <ComboBox
            options={productOptions}
            placeholder="Buscar producto..."
            onChange={(value) => onProductChange(value, index)}
            searchFn={onSearch}
            isLoading={isLoading}
            error={
              formik.getFieldMeta(`products.${index}.product`).touched
                ? formik.getFieldMeta(`products.${index}.product`).error
                : undefined
            }
            className="w-full"
          />
          {formik.getFieldMeta(`products.${index}.product`).touched &&
            formik.getFieldMeta(`products.${index}.product`).error && (
              <p className="text-sm text-destructive mt-1">
                {formik.getFieldMeta(`products.${index}.product`).error}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`products.${index}.quantity`}
            className="text-sm font-medium"
          >
            Cantidad
          </Label>
          <Input
            id={`products.${index}.quantity`}
            name={`products.${index}.quantity`}
            type="number"
            min="1"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.products[index].quantity}
            className={`h-10 ${
              formik.getFieldMeta(`products.${index}.quantity`).touched &&
              formik.getFieldMeta(`products.${index}.quantity`).error
                ? "border-destructive focus:ring-destructive"
                : ""
            }`}
          />
          {formik.getFieldMeta(`products.${index}.quantity`).touched &&
            formik.getFieldMeta(`products.${index}.quantity`).error && (
              <p className="text-sm text-destructive mt-1">
                {formik.getFieldMeta(`products.${index}.quantity`).error}
              </p>
            )}
        </div>

        <Button
          type="button"
          onClick={() => onRemoveProduct(index)}
          variant="destructive"
          size="icon"
          className="flex justify-center items-center h-10 w-10"
          disabled={disableRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const OrderTotal: React.FC<OrderTotalProps> = ({ total }) => (
  <div className="mt-6 p-6 bg-muted/50 rounded-lg border shadow-sm">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Total del Pedido</h3>
      <span className="text-2xl font-bold">{formatCurrency(total)}</span>
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      Este es el costo total basado en el precio base de los productos y sus
      cantidades.
    </p>
  </div>
);

/**
 * Componente NuevoPedido
 *
 * Componente de formulario para crear nuevos pedidos a proveedores.
 * Implementa manejo de estado, validación de formularios y solicitudes API.
 */
export default function NewOrder(): JSX.Element {
  const navigate = useNavigate();
  const isAdmin = useAdmin();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [providerSearchTerm, setProviderSearchTerm] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  let amount = 0;

  // Hooks para búsqueda
  const { searchProvidersQuery } = useSearchProviders(providerSearchTerm);
  const { searchProductsQuery } = useSearchProducts(searchTerm);

  // Esquema de validación usando Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre del pedido es obligatorio"),
    providerId: Yup.string().required("Debe seleccionar un proveedor"),
    storeId: Yup.string().required("Debe seleccionar una tienda"),
    products: Yup.array()
      .of(
        Yup.object({
          product: Yup.string().required("Debe seleccionar un producto"),
          quantity: Yup.number()
            .required("La cantidad es obligatoria")
            .positive("La cantidad debe ser positiva")
            .integer("La cantidad debe ser un número entero"),
        })
      )
      .min(1, "Debe agregar al menos un producto"),
  });

  // Inicializar Formik
  const formik = useFormik<OrderFormValues>({
    initialValues: {
      name: "",
      providerId: "",
      products: [{ product: "", quantity: 1 }],
      storeId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const cleanedProducts = values.products.filter((p) => p.product !== "");
      const dataToSubmit = { ...values, products: cleanedProducts, amount };
      createOrderMutation.mutate(dataToSubmit);
    },
  });

  // Hooks para datos
  const { providersQuery } = useProviders({ page: 1, limit: 100 });
  const { storesQuery } = useStores({ page: 1, limit: 200 });
  const { getProviderById } = useProvider(selectedProvider);

  // Obtener productos para el proveedor seleccionado
  const productIds = useMemo(
    () => getProviderById.data?.productsIds || [],
    [getProviderById.data]
  );

  const { getProductsByIds } = useProductsByIds(productIds);

  // Estados de carga
  const providersLoading =
    providersQuery.isLoading || searchProvidersQuery.isLoading;
  const storesLoading = storesQuery.isLoading;
  const selectedProviderLoading = getProviderById.isLoading;
  const productsLoading =
    getProductsByIds.isLoading ||
    selectedProviderLoading ||
    searchProductsQuery.isLoading;

  // Memorizar datos para evitar renderizados innecesarios
  const providers = useMemo<ProviderModel[]>(
    () => [
      ...(searchProvidersQuery.data || []),
      ...(providersQuery.data || []),
    ],
    [searchProvidersQuery.data, providersQuery.data]
  );

  const stores = useMemo<Store[]>(
    () => storesQuery.data || [],
    [storesQuery.data]
  );

  const products = useMemo<Product[]>(
    () => [
      ...(searchProductsQuery.data || []),
      ...(getProductsByIds.data || []),
    ],
    [searchProductsQuery.data, getProductsByIds.data]
  );

  // Filtrar productos por término de búsqueda y disponibilidad
  const availableProducts = useMemo(() => {
    if (!products.length) return [];

    return products.filter(
      (product) =>
        !selectedProductIds.has(product.id) ||
        formik.values.products.some((p) => p.product === product.id)
    );
  }, [products, selectedProductIds, formik.values.products]);

  // Actualizar nombre del pedido cuando cambia proveedor o tienda
  const updateOrderName = useCallback(
    (providerId: string, storeId: string) => {
      if (!formik.values.name) return;

      const userInputParts = formik.values.name.split("-");
      const userInput = userInputParts[0]?.trim() || formik.values.name;

      const providerName = providerId
        ? providers.find((p) => p.id === providerId)?.name || ""
        : "";

      const storeName = storeId
        ? stores.find((s) => s.id === storeId)?.name || ""
        : "";

      if (providerName && storeName) {
        const newName = `${userInput} - ${providerName} - ${storeName}`;
        formik.setFieldValue("name", newName);
      }
    },
    [formik, providers, stores]
  );

  // Mutación para crear pedido
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderFormValues) => {
      const response = await BackendApi.post("/order/create", {
        ...orderData,
        status: "open",
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("¡Pedido creado exitosamente!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/orders");
    },
    onError: (error: Error) => {
      toast.error(
        `Error al crear el pedido: ${error.message || "Error desconocido"}`
      );
    },
  });

  // Gestión de cambio de proveedor
  const handleProviderChange = useCallback(
    (value: string) => {
      setSelectedProvider(value);
      formik.setFieldValue("providerId", value);
      setSelectedProductIds(new Set());
      formik.setFieldValue("products", [{ product: "", quantity: 1 }]);

      if (formik.values.name) {
        updateOrderName(value, selectedStore);
      }
    },
    [selectedStore, formik, updateOrderName]
  );

  // Gestión de cambio de tienda
  const handleStoreChange = useCallback(
    (value: string) => {
      setSelectedStore(value);
      formik.setFieldValue("storeId", value);

      if (formik.values.name) {
        updateOrderName(selectedProvider, value);
      }
    },
    [selectedProvider, formik, updateOrderName]
  );

  // Gestión de selección de producto
  const handleProductChange = useCallback(
    (value: string, index: number) => {
      if (value && selectedProductIds.has(value)) {
        toast.error(
          "Este producto ya está seleccionado. Por favor, elija otro."
        );
        return;
      }

      const oldProduct = formik.values.products[index].product;
      if (oldProduct) {
        const newSet = new Set(selectedProductIds);
        newSet.delete(oldProduct);
        setSelectedProductIds(newSet);
      }

      if (value) {
        setSelectedProductIds(new Set([...selectedProductIds, value]));
      }

      formik.setFieldValue(`products.${index}.product`, value);
    },
    [selectedProductIds, formik]
  );

  // Agregar nueva fila de producto
  const addProductRow = useCallback(() => {
    formik.setFieldValue("products", [
      ...formik.values.products,
      { product: "", quantity: 1 },
    ]);
  }, [formik]);

  // Eliminar fila de producto
  const removeProductRow = useCallback(
    (index: number) => {
      if (formik.values.products.length > 1) {
        const productToRemove = formik.values.products[index].product;
        if (productToRemove) {
          const newSet = new Set(selectedProductIds);
          newSet.delete(productToRemove);
          setSelectedProductIds(newSet);
        }

        const updatedProducts = [...formik.values.products];
        updatedProducts.splice(index, 1);
        formik.setFieldValue("products", updatedProducts);
      } else {
        toast.error("Se requiere al menos un producto");
      }
    },
    [formik, selectedProductIds]
  );

  // Calcular total del pedido
  const total = useMemo(() => {
    return formik.values.products.reduce((sum, item) => {
      if (!item.product) return sum;

      const productDetails = products.find((p) => p.id === item.product);
      if (!productDetails) return sum;

      return sum + productDetails.basePrice * item.quantity;
    }, 0);
  }, [formik.values.products, products]);

  amount = total;

  if (!isAdmin) {
    navigate("/inventory");
    return <></>;
  }

  // Mostrar pantalla de carga si es necesario
  if (
    providersLoading ||
    storesLoading ||
    (selectedProvider && selectedProviderLoading)
  ) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl mt-10 md:mt-4">
      <Card className="shadow-lg border-0">
        <FormHeader />

        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-6">
            {/* Nombre del Pedido */}
            <OrderNameField formik={formik} />

            {/* Selección de Proveedor */}
            <ProviderSelect
              formik={formik}
              providers={providers}
              onProviderChange={handleProviderChange}
              onSearch={setProviderSearchTerm}
              isLoading={providersLoading}
            />

            {/* Selección de Tienda */}
            <StoreSelect
              formik={formik}
              stores={stores}
              onStoreChange={handleStoreChange}
            />

            {/* Sección de Productos */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Productos</h3>
                <Button
                  type="button"
                  onClick={addProductRow}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!selectedProvider || productsLoading}
                >
                  <Plus className="h-4 w-4" />
                  Agregar Producto
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Búsqueda de Productos */}
              {selectedProvider &&
                !productsLoading &&
                availableProducts.length > 0 && (
                  <ProductSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isLoading={searchProductsQuery.isLoading}
                  />
                )}

              {/* Estado de carga para productos */}
              {selectedProvider && productsLoading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Cargando productos...</span>
                </div>
              )}

              {/* Mensaje de no hay productos disponibles */}
              {selectedProvider &&
                !productsLoading &&
                availableProducts.length === 0 && (
                  <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-lg border border-amber-200 px-4">
                    No hay productos disponibles para este proveedor. Por favor,
                    seleccione otro proveedor.
                  </div>
                )}

              {/* Filas de productos */}
              <div className="space-y-4">
                {formik.values.products.map((product, index) => (
                  <ProductRow
                    key={index}
                    index={index}
                    formik={formik}
                    availableProducts={availableProducts}
                    onProductChange={handleProductChange}
                    onRemoveProduct={removeProductRow}
                    disableRemove={formik.values.products.length <= 1}
                    onSearch={setSearchTerm}
                    isLoading={searchProductsQuery.isLoading}
                  />
                ))}
              </div>

              {/* Error de validación del array de productos */}
              {formik.touched.products &&
                typeof formik.errors.products === "string" && (
                  <p className="text-sm text-destructive mt-2">
                    {formik.errors.products}
                  </p>
                )}

              {/* Total del pedido */}
              {selectedProvider && !productsLoading && products.length > 0 && (
                <OrderTotal total={total} />
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t p-6">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando Pedido...
                </>
              ) : (
                "Crear Pedido"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
