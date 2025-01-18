import { RootState } from "@/app/store";
import { useAppSelector } from "@/config/react-redux.adapter";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  children: React.ReactNode;
}
export default function ProtectedRoutes({ children }: Props) {
  const { userInfo, token } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo || !token) {
      navigate("/login");
    }
  }, [userInfo, token, navigate]);

  return <>{children}</>;
}
