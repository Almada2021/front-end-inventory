import { ArchiveIcon } from "lucide-react";

import { LoginForm } from "@/components/forms/login-form";
import { useAppSelector } from "@/config/react-redux.adapter";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router";
import { useEffect } from "react";
interface Props {
  show: boolean;
}
export default function LoginPage({ show }: Props) {
  const { userInfo, token, loading } = useAppSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo && token) {
      navigate("/");
    }
  }, [userInfo, token, navigate]);
  if (loading) {
    return <div>Loading</div>;
  }
  if (!show) return null;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ArchiveIcon className="size-4" />
          </div>
          Inventario Alm.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
