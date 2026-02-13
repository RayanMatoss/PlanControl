import { useLocation } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { PlanControlLogo } from '@/components/PlanControlLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <NavLink to="/" className="flex items-center gap-2 [&_h1]:group-data-[collapsible=icon]:hidden [&_.relative]:group-data-[collapsible=icon]:!h-10 [&_.relative]:group-data-[collapsible=icon]:!w-10">
          <PlanControlLogo showText={true} className="[&_h1]:text-base" />
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'} tooltip="Início" className="[&_svg]:!size-5 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:![&_svg]:!size-6">
                  <NavLink to="/" className="[&>span:last-child]:group-data-[collapsible=icon]:hidden">
                    <Home className="h-5 w-5" />
                    <span>Início</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/configuracoes'} tooltip="Configurações" className="[&_svg]:!size-5 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:![&_svg]:!size-6">
                  <NavLink to="/configuracoes" className="[&>span:last-child]:group-data-[collapsible=icon]:hidden">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
