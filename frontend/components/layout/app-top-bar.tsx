"use client"

import { Bell, Flame, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppTopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 px-4 py-4 backdrop-blur-sm sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-center gap-3">
        <SidebarTrigger className="text-slate-300 hover:text-white" />
        <Separator orientation="vertical" className="h-6 bg-white/10" />
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-2">
          <Flame className="h-4 w-4 text-cyan-300" />
          <Input
            placeholder="Rechercher une activité, un objectif..."
            className="h-8 border-0 bg-transparent text-sm text-white placeholder:text-slate-400 focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 text-white">
            <Bell className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button className="hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 md:flex">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle action
          </Button>
        </div>
      </div>
    </header>
  )
}

