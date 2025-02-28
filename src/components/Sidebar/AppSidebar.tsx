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
  ListOrdered,
  Users,
  ShoppingCart,
} from "lucide-react";
import { Home, Settings } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
interface MenuItem {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}
const AdminItems: MenuItem[] = [
  {
    title: "Sucursales y Cajas",
    url: "/inventory/stores",
    icon: Store,
  },
  {
    title: "Reportes",
    url: "#",
    icon: FileSpreadsheet,
  },
  {
    title: "Ventas",
    url: "/inventory/sales",
    icon: ShoppingCart,
  },
];
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
    title: "Ordenes",
    url: "/inventory/orders",
    icon: ListOrdered,
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
  const navigate = useNavigate();
  const out = () => {
    dispatch(signOut());
    navigate("/");
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
        className="flex flex-col md:flex-row"
      >
        <Sidebar variant="floating" collapsible="icon">
          <SidebarTrigger />

          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Modulos</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu draggable={false}>
                  {items.map((item) => (
                    <SidebarMenuItem className="select-none" key={item.title}>
                      <SidebarMenuButton asChild>
                        <a draggable={false} href={item.url}>
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
              <SidebarMenu draggable={false}>
                <SidebarGroupLabel>Modulos de Administrador</SidebarGroupLabel>
                {AdminItems.map((item) => (
                  <SidebarMenuItem className="select-none" key={item.title}>
                    <SidebarMenuButton asChild>
                      <a draggable={false} href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div>
                      {" "}
                      {/* Changed from button to div */}
                      <SidebarMenuButton>
                        <User2 /> Username
                        <ChevronUp className="ml-auto" />
                      </SidebarMenuButton>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width] shadow shadow-black "
                  >
                    <DropdownMenuItem>
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={out}>
                      <span>Sign out</span>
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
