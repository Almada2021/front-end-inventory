import { useEffect, useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import useLocalStorage from "@/hooks/browser/useLocalStorage";
import { useNavigate } from "react-router";

type PageModes = "store" | "till" | "pos";
export default function POSPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<PageModes>("store");
  const [confirmTill, setConfirmTill] = useState(false);
  const [currentTill, setCurrentTill] = useState<Till | undefined>();
  const [storeId, setStoreId] = useState<string | undefined>(undefined);
  const [tillStorage, setTillStorage] = useLocalStorage<string | null>(
    "till",
    null
  );
  const openTillMutate = useMutation({
    mutationFn: async () => {
      try {
        if (!currentTill) throw "Not Till Selected";
        await BackendApi.patch<Till>(`/till/open/${currentTill.id}`).then(
          async (till) => {
            const data = await till.data;
            if (typeof data.id == "string") {
              setTillStorage(data.id);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    mutationKey: ["till", "open"],
  });
  useEffect(() => {
    if (tillStorage) {
      navigate(`./${tillStorage}`);
    }
  }, [tillStorage, navigate]);
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
        {currentTill && (
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
                  onClick={async () => {
                    // FN to enable till and save to local storage current till
                    await openTillMutate.mutate();
                  }}
                >
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <TillSelectorScreen
          changeMode={(id: string, till: Till) => {
            if(!till.status){
              setConfirmTill(true);
              setCurrentTill(till);

            }else {
              setTillStorage(till.id);
              navigate(`./${tillStorage}`);

            }
            // setMode("pos");1
          }}
          storeId={storeId}
        />
      </>
    );
  }
}
