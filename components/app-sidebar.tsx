'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Home, FileText, Users, Settings, FolderPlus, CheckCircle2, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { animateSidebarNav } from '@/lib/anime-utils';

const navigationItems = [
  { title: 'Dashboard', icon: Home, href: '/' },
  { title: 'Proyectos', icon: FolderPlus, href: '/projects' },
  { title: 'Hitos de Cobro', icon: FileText, href: '/milestones' },
  { title: 'Conciliación', icon: CheckCircle2, href: '/reconciliation' },
  { title: 'Automatización', icon: Zap, href: '/automation' },
  { title: 'Analistas', icon: Users, href: '/analysts' },
  { title: 'Configuración', icon: Settings, href: '/settings' },
];

export function AppSidebar() {
  const pathname = usePathname();

  useEffect(() => {
    animateSidebarNav();
  }, []);

  return (
    <Sidebar className="border-r border-white/[0.06] bg-[#0B1120] overflow-hidden">
      {/* Animated gradient blobs — same as login left panel */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-40%] w-[140%] h-[50%] rounded-full bg-[#1e40af] opacity-[0.15] blur-[80px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-40%] w-[120%] h-[40%] rounded-full bg-[#7c3aed] opacity-[0.10] blur-[70px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[50%] left-[-20%] w-[80%] h-[30%] rounded-full bg-[#0ea5e9] opacity-[0.08] blur-[60px] animate-pulse [animation-delay:4s]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <SidebarHeader className="relative z-10 border-b border-white/[0.06] px-6 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-200 group-hover:bg-white/15">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white/90">IASSAT</span>
            <span className="text-[11px] font-medium text-white/40 tracking-wide">PayFlow</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="relative z-10 px-3 py-4">
        <SidebarMenu className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href} className="sidebar-nav-item">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`transition-all duration-150 rounded-lg h-10 ${
                    isActive
                      ? 'bg-white/10 text-white backdrop-blur-sm shadow-sm'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                  }`}
                >
                  <Link href={item.href} className="flex items-center gap-3 px-3">
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
