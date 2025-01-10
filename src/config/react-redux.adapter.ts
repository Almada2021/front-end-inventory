import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "@/app/store";

// Crear un hook tipado de useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
