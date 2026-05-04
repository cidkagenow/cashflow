'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <AppTopbar />
        <main className="flex-1 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
