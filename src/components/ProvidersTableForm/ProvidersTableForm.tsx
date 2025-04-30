import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DataTableView from "../DataTable/DataTable";
import { useState } from "react";
import { Button } from "../ui/button";
import SuppliersForm from "../forms/suppliers-form";
import { useProviders } from "@/hooks/providers/useProviders";
interface IProvidersTableForm {
  providers: string[];
  children?: React.ReactNode;
  setProviders: React.Dispatch<React.SetStateAction<string[]>>;
  setProviderNames: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  isProviderDialogOpen: boolean;
  setIsProviderDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ProvidersTableForm({
  providers,
  setProviders,
  setProviderNames,
  isProviderDialogOpen,
  setIsProviderDialogOpen,
  children,
}: IProvidersTableForm) {
  const [createMode, setCreateMode] = useState(false);
  const { providersQuery } = useProviders();
  return (
    <AlertDialog
      open={isProviderDialogOpen}
      onOpenChange={setIsProviderDialogOpen}
    >
      <AlertDialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {!createMode ? "Busca los Proveedores" : "Crear Proveedor"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {!createMode
              ? "Marcalos y confirma para agregar"
              : "Crea un nuevo Proveedor"}
          </AlertDialogDescription>
          {!createMode && (
            <DataTableView
              initial={providers}
              notifyProvidersSelected={(value: string[], names?: string) => {
                setProviders(value);
                if (names) {
                  const nameArray = names.split(", ");
                  const namesMap: Record<string, string> = {};

                  value.forEach((id, index) => {
                    namesMap[id] = nameArray[index] || `Proveedor ${id}`;
                  });

                  setProviderNames(namesMap);
                }
              }}
            />
          )}
          {createMode && <SuppliersForm />}
          <Button
            onClick={() => {
              if (createMode) {
                providersQuery.refetch();
              }
              setCreateMode((m) => !m);
            }}
          >
            {!createMode ? "Crear Proveedor" : "Volver"}
          </Button>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {!createMode && <AlertDialogAction>Seleccionar</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
      {children}
    </AlertDialog>
  );
}
