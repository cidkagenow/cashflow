'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Home, FileText, Users, Settings, LogOut, ChevronRight, FolderPlus, CheckCircle2, Zap } from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    title: 'Proyectos',
    icon: FolderPlus,
    href: '/projects',
  },
  {
    title: 'Hitos de Cobro',
    icon: FileText,
    href: '/milestones',
  },
  {
    title: 'Conciliación',
    icon: CheckCircle2,
    href: '/reconciliation',
  },
  {
    title: 'Automatización',
    icon: Zap,
    href: '/automation',
  },
  {
    title: 'Analistas',
    icon: Users,
    href: '/analysts',
  },
  {
    title: 'Configuración',
    icon: Settings,
    href: '/settings',
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-xs font-bold text-sidebar-primary-foreground">PP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">IASSAT</span>
            <span className="text-xs text-sidebar-foreground/70">PayFlow</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <a href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/logout" className="flex items-center gap-3 text-sidebar-foreground hover:text-sidebar-accent-foreground">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
