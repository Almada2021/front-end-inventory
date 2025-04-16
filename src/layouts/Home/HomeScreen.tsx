import { RootState } from "@/app/store";
import { SalesByDayGraph } from "@/components/Graphs/SalesByDayGraph";
import TopSales from "@/components/stats/TopSales";
import { useAppSelector } from "@/config/react-redux.adapter";
import { useAdmin } from "@/hooks/browser/useAdmin";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  show: boolean;
}
export default function HomeScreen({ show }: Props) {
  const { userInfo, token } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const isAdmin = useAdmin();
  useEffect(() => {
    if (!userInfo || !token) {
      navigate("/login");
    }
  }, [userInfo, token, navigate]);

  if (!show) return null;
  return (
    <main className="mt-2 w-full 1 p-4 md:p-10 md:space-y-4">
      <h2 className="text-3xl font-bold mt-10 md:mt-4">
        Bienvenido {userInfo?.name}
      </h2>
      <h2 className="text-sm text-gray-500 ">{userInfo?.email}</h2>
      <h2 className="text-xs ">{userInfo?.id}</h2>
      {isAdmin && (

      <div className="w-full flex flex-row flex-wrap">
        <div className="max-h-[400px] w-full md:w-1/2 mb-10">
          <SalesByDayGraph />
        </div>
        <TopSales />
      </div>
      )}
    </main>
  );
}
