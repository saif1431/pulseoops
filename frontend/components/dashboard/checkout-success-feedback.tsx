"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"

const STORAGE_KEY = "pulseops_upgrade_at"
const UPGRADE_WINDOW_MS = 24 * 60 * 60 * 1000

export function CheckoutSuccessFeedback() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const checkoutStatus = searchParams.get("checkout")
  const [now] = React.useState(() => Date.now())

  React.useEffect(() => {
    if (checkoutStatus === "success") {
      toast.success("🎉 Welcome to Pro! Your subscription is active.")
      const now = Date.now()
      localStorage.setItem(STORAGE_KEY, String(now))

      const params = new URLSearchParams(searchParams.toString())
      params.delete("checkout")
      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(nextUrl)
    }
  }, [checkoutStatus, pathname, router, searchParams])

  const showWelcome = React.useMemo(() => {
    if (checkoutStatus === "success") {
      return true
    }

    if (typeof window === "undefined") {
      return false
    }

    const upgradedAt = localStorage.getItem(STORAGE_KEY)
    if (!upgradedAt) {
      return false
    }

    const upgradedTime = Number(upgradedAt)
    const recent = !Number.isNaN(upgradedTime) && now - upgradedTime <= UPGRADE_WINDOW_MS

    if (!recent) {
      localStorage.removeItem(STORAGE_KEY)
    }

    return recent
  }, [checkoutStatus, now])

  if (!showWelcome) {
    return null
  }

  return (
    <Card className="border-status-up/40 bg-status-up/5">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-status-up/15 p-2">
            <Sparkles className="h-4 w-4 text-status-up" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Welcome to Pro</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Your subscription is active. Enjoy faster checks, more monitors, and premium incident workflows.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
