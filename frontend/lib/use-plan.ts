"use client"

import { useSession } from "next-auth/react"

import { PLANS, PlanName } from "@/lib/plans"

export function usePlan() {
  const session = useSession()
  const sessionPlan = session.data?.user?.plan
  const plan: PlanName =
    sessionPlan === "PRO" || sessionPlan === "BUSINESS" ? sessionPlan : "FREE"

  return {
    plan,
    isPro: plan === "PRO" || plan === "BUSINESS",
    isBusiness: plan === "BUSINESS",
    canAddMonitor: (currentCount: number) => {
      const limit = PLANS[plan].monitors
      return limit === -1 || currentCount < limit
    },
    canCreateStatusPage: (currentCount: number) => {
      const limit = PLANS[plan].statusPages
      return limit === -1 || currentCount < limit
    },
  }
}
