import { useState } from "react";
import CheckoutScreen from "./CheckoutScreen";
import StoreSelectorScreen from "./StoreSelectorScreen";
import TillSelectorScreen from "./TillSelectorScreen";
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
import { Till } from "@/infrastructure/interfaces/till.interface";
type PageModes = "store" | "till" | "pos";
export default function POSPage() {
  const [mode, setMode] = useState<PageModes>("store");
  const [confirmTill, setConfirmTill] = useState(false);
  const [currentTill, setCurrentTill] = useState<Till | undefined>();
  const [storeId, setStoreId] = useState<string | undefined>(undefined);
  if (mode == "store") {
    return (
      <StoreSelectorScreen
        changeMode={(id: string) => {
          setMode("till");
          setStoreId(id);
        }}
      />
    );
  }
  if (mode == "till" && storeId) {
    return (
      <>
        <AlertDialog open={confirmTill}>
          <AlertDialogTrigger></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Estas seguro que deseas abrir la caja {currentTill?.name}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setConfirmTill(false);
                }}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // FN to enable till and save to local storage current till
                }}
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TillSelectorScreen
          changeMode={(id: string, till: Till) => {
            setConfirmTill(true);
            setCurrentTill(till);
            // setMode("pos");
            console.log(id);
          }}
          storeId={storeId}
        />
      </>
    );
  }
  return <CheckoutScreen />;
}
