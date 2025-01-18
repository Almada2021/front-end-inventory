// import { RootState } from "@/app/store";
// import { useAppSelector } from "@/config/react-redux.adapter";
import { signOut } from "@/app/features/user/userSlice";
import { RootState } from "@/app/store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/config/react-redux.adapter";
import { useIsMobile } from "@/hooks/use-mobile";
import { validateTime } from "@/lib/jwt.utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  BadgeDollarSign,
  Brain,
  ChevronUp,
  FileSpreadsheet,
  LucideProps,
  Milk,
  Store,
  User2,
  TruckIcon,
  Users,
} from "lucide-react";
import { Home, Settings } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
interface MenuItem {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}
const items: MenuItem[] = [
  {
    title: "Inicio",
    url: "/inventory",
    icon: Home,
  },
  {
    title: "Punto de Venta",
    url: "/inventory/checkout",
    icon: BadgeDollarSign,
  },
  {
    title: "IA",
    url: "/inventory/ai",
    icon: Brain,
  },
  {
    title: "Sucursales y Cajas",
    url: "/inventory/ai",
    icon: Store,
  },
  {
    title: "Productos",
    url: "/inventory/products",
    icon: Milk,
  },
  {
    title: "Empleados",
    url: "/inventory/employee",
    icon: Users,
  },
  {
    title: "Proveedores",
    url: "/inventory/suppliers",
    icon: TruckIcon,
  },
  {
    title: "Reportes",
    url: "#",
    icon: FileSpreadsheet,
  },
  {
    title: "Configuracion",
    url: "#",
    icon: Settings,
  },
];

export default function AppSidebar({ children }: { children: JSX.Element }) {
  const { userInfo, token } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const out = () => {
    dispatch(signOut());
  };
  useEffect(() => {
    if (token) {
      if (validateTime(token)) {
        dispatch(signOut());
      }
    }
  }, [token, dispatch]);

  if (!userInfo || !token) {
    return <>{children}</>;
  }

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "20rem",
            "--sidebar-width-mobile": "20rem",
          } as React.CSSProperties
        }
      >
        <Sidebar variant="floating" collapsible="icon">
          <SidebarTrigger />

          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Modulos</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Modulos de Administrador</SidebarGroupLabel>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User2 /> {userInfo.name}
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width] border-t-2 border-b-2 border-r-2 border-l-2 "
                  >
                    <DropdownMenuItem>
                      <span>Cuenta</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Informacion</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={out}>
                      <span>Cerrar Session</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        {children}
      </SidebarProvider>
    </>
  );
}
