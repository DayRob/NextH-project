"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ActivitySquare,
  LayoutDashboard,
  NotebookPen,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { title: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { title: "Activités", href: "/activities", icon: ActivitySquare },
  { title: "Objectifs & défis", href: "/challenges", icon: Target },
  { title: "Journal", href: "/journal", icon: NotebookPen },
  { title: "Profil & réglages", href: "/settings", icon: UserRound },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-white/5 bg-slate-950/80 text-white">
      <SidebarHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-400/10 to-purple-500/10 p-3">
          <div className="rounded-xl bg-white/10 p-2">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-cyan-200/80">NextH</p>
            <p className="text-xs text-slate-400">Votre copilote bien-être</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center gap-3 text-sm">
                      <item.icon className="h-4 w-4 text-cyan-200" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.href === "/" && <SidebarMenuBadge className="bg-cyan-500/20 text-cyan-200">Live</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/20 p-3">
          <p className="text-sm font-semibold text-white">Mode Focus</p>
          <p className="text-xs text-slate-400">Activez le suivi en temps réel</p>
          <Badge
            variant="secondary"
            className="mt-3 w-full justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
          >
            Bientôt
          </Badge>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

