"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bell, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

type TopbarUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

type TopbarProps = {
  user: TopbarUser
}

function getInitials(name?: string | null, email?: string | null) {
  const base = name?.trim() || email?.split("@")[0] || "U"
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
  }
  return (parts[0]?.[0] ?? "U").toUpperCase()
}

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname()
  const initials = getInitials(user?.name, user?.email)
  
  let title = "Dashboard"
  if (pathname?.includes("/monitors")) title = "Monitors"
  else if (pathname?.includes("/incidents")) title = "Incidents"
  else if (pathname?.includes("/status-pages")) title = "Status Pages"
  else if (pathname?.includes("/settings")) title = "Settings"

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-4 border-b border-line-default/50 bg-bg-base/80 backdrop-blur-md px-6 sm:px-8">
      <div className="flex flex-1 items-center gap-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 -ml-2 text-text-secondary hover:text-brand-default transition-colors">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 border-r-border-default/50 bg-bg-base" aria-describedby={undefined}>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar user={user} className="border-none w-full" />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-black text-text-primary tracking-tight">{title}</h1>
      </div>

      <div className="hidden md:flex flex-1 items-center">
        <h1 className="text-2xl font-black text-text-primary tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative h-10 w-10 flex items-center justify-center text-text-tertiary hover:text-brand-default transition-all bg-white border border-line-default/50 rounded-xl shadow-sm hover:shadow-md">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-status-down ring-2 ring-white shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          <span className="sr-only">Notifications</span>
        </button>
        
        {user?.image ? (
          <img
            src={user.image}
            alt={user?.name || user?.email || "User"}
            className="hidden md:block h-10 w-10 rounded-full object-cover border border-line-default/50 shadow-lg shadow-brand-default/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-brand-default text-white text-xs font-black shadow-lg shadow-brand-default/20 cursor-pointer hover:scale-105 transition-transform">
            {initials}
          </div>
        )}
      </div>
    </header>
  )
}
