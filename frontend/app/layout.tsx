import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppTopBar } from "@/components/layout/app-top-bar"
import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "NextH · Tableau de bord bien-être",
  description: "Pilotez vos habitudes santé avec une interface moderne et immersive.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn("bg-slate-950 text-foreground antialiased", inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-950 text-white">
              <AppSidebar />
              <SidebarInset className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_55%)]" />
                <div className="relative z-10 flex min-h-screen flex-col">
                  <AppTopBar />
                  <div className="flex-1 px-4 pb-12 pt-6 sm:px-8 lg:px-12">{children}</div>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
