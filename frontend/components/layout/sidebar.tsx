"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Activity, AlertTriangle, Globe, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Monitors", href: "/monitors", icon: Activity },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Status Pages", href: "/status-pages", icon: Globe },
  { name: "Settings", href: "/settings", icon: Settings },
]

type SidebarUser = {
  name?: string | null
  email?: string | null
  plan?: string | null
  image?: string | null
}

type SidebarProps = {
  className?: string
  user: SidebarUser
}

function getInitials(name?: string | null, email?: string | null) {
  const base = name?.trim() || email?.split("@")[0] || "U"
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
  }
  return (parts[0]?.[0] ?? "U").toUpperCase()
}

function getPlanLabel(plan?: string | null) {
  const normalized = plan?.toUpperCase() || "FREE"
  if (normalized === "BUSINESS") return "Business"
  if (normalized === "PRO") return "Pro"
  return "Free"
}

export function Sidebar({ className, user }: SidebarProps) {
  const pathname = usePathname()
  const initials = getInitials(user?.name, user?.email)
  const planLabel = getPlanLabel(user?.plan)

  return (
    <div className={cn("flex h-full w-[280px] flex-col bg-bg-base border-r border-line-default/50", className)}>
      <div className="flex h-24 items-center px-8 shrink-0">
        <Link href="/" className="flex items-center gap-4 font-bold text-2xl text-text-primary group">
          <Image src="/logo-transparent.png" alt="PulseOps Logo" width={196} height={54} className="h-20 w-auto" priority />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-8">
        <nav className="space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-brand-default text-white shadow-lg shadow-brand-default/20"
                    : "text-text-secondary hover:bg-white hover:text-text-primary hover:shadow-sm"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-text-tertiary group-hover:text-brand-default"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 shrink-0 space-y-6">
        <div className="rounded-3xl bg-white p-6 border border-line-default/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_10%,rgba(216,180,254,0.05)_0,transparent_50%)] pointer-events-none" />
          <div className="flex flex-col mb-4 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-text-tertiary">Current Tier</span>
            <span className="text-base font-black text-text-primary mt-1">{planLabel} Workspace</span>
          </div>
          <Button variant="primary" size="sm" className="w-full h-10 rounded-xl font-bold text-xs bg-brand-default hover:bg-brand-default/90 transition-all shadow-md shadow-brand-default/20 relative z-10">Upgrade Plan</Button>
        </div>

        <div className="flex items-center gap-4 px-2 py-2">
          {user?.image ? (
            <img
              src={user.image}
              alt={user?.name || user?.email || "User"}
              className="h-12 w-12 shrink-0 rounded-full object-cover border border-line-default/50 shadow-md shadow-brand-default/20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-default text-white shadow-md shadow-brand-default/20 font-black text-sm">
              {initials}
            </div>
          )}
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-black text-text-primary">
              {user?.name || user?.email || "User"}
            </span>
            <span className="truncate text-[11px] text-text-tertiary font-bold uppercase tracking-widest">{planLabel} plan</span>
          </div>
          <button
            className="text-text-tertiary hover:text-status-down transition-colors focus:outline-none p-2 hover:bg-status-down/5 rounded-xl"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
