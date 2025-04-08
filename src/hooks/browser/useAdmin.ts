import { RootState } from "@/app/store";
import { useAppSelector } from "@/config/react-redux.adapter";

export const useAdmin = () => {
    const { userInfo} = useAppSelector((state: RootState) => state.auth);
    const isAdmin = userInfo?.roles?.includes("ADMIN_ROLE");
    return isAdmin
}