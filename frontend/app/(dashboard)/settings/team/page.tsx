import * as React from "react"
import { getSubscription } from "@/lib/api/billing"
import { TeamClient } from "@/components/settings/team-client"

export default async function TeamPage() {
  const subscription = await getSubscription().catch(() => ({ 
    plan: "FREE" as const, 
    id: "free", 
    status: "active" as const, 
    currentPeriodEnd: "" 
  }))

  return <TeamClient plan={subscription.plan} />
}
