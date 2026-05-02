import * as React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

// Mock subscription check
async function checkSubscription() {
  // Simulating an active subscription for now.
  // When this is false, it redirects to pricing.
  return true
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const hasActiveSubscription = await checkSubscription()

  // if (!hasActiveSubscription) {
  //   redirect("/pricing?reason=subscription_required")
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base text-text-primary">
      <div className="hidden md:block shrink-0 h-full">
        <Sidebar user={session.user} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={session.user} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
