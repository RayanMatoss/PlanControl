import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} defaultOpen={false}>
      <div
        className="shrink-0 self-stretch"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <AppSidebar />
      </div>
      <SidebarInset className="relative">
        {/* Faixa invisível na borda esquerda: passar o mouse abre a sidebar */}
        <div
          className="absolute left-0 top-0 z-10 h-full w-2 shrink-0"
          onMouseEnter={() => setSidebarOpen(true)}
          aria-hidden
        />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
