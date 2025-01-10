// import { RootState } from "@/app/store";
// import { useAppSelector } from "@/config/react-redux.adapter";
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
  Users,
} from "lucide-react";
import { Home, Settings } from "lucide-react";

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
    url: "#",
    icon: Milk,
  },
  {
    title: "Empleados",
    url: "#",
    icon: Users,
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
  // const { userInfo, token } = useAppSelector((state: RootState) => state.auth);
  // if (!userInfo || !token) {
  //   return <>{children}</>;
  // }
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
              <SidebarGroupLabel>Application</SidebarGroupLabel>
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
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User2 /> Username
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem>
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
