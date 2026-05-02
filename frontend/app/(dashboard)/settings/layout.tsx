"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Bell, Users, CreditCard } from "lucide-react"

import { cn } from "@/lib/utils"

const settingsNavigation = [
  { name: "Profile", href: "/settings/profile", icon: User },
  { name: "Notifications", href: "/settings/notifications", icon: Bell },
  { name: "Team", href: "/settings/team", icon: Users },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-3xl border border-line-default/50 p-3 shadow-sm">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {settingsNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all whitespace-nowrap group",
                    isActive
                      ? "bg-brand-default text-white shadow-md shadow-brand-default/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-base"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-text-tertiary group-hover:text-brand-default transition-colors")} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 w-full max-w-3xl mx-auto md:mx-0">
          {children}
        </main>
      </div>
    </div>
  )
}
