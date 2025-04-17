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
    <main className="w-full px-4 py-6 md:p-10 space-y-4 mt-10 md:mt-4">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Bienvenido {userInfo?.name}
        </h2>
        <h2 className="text-sm text-gray-500">{userInfo?.email}</h2>
        <h2 className="text-xs text-gray-400">{userInfo?.id}</h2>
      </div>

      {isAdmin && (
        <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-6 mt-6">
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <SalesByDayGraph />
            </div>
          </div>
          <div className="w-full md:w-[45%]">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <TopSales />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
