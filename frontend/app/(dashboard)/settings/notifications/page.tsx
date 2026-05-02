import * as React from "react"
import { getSubscription } from "@/lib/api/billing"
import { NotificationsClient } from "@/components/settings/notifications-client"

export default async function NotificationsPage() {
  const subscription = await getSubscription().catch(() => ({ 
    plan: "FREE" as const, 
    id: "free", 
    status: "active" as const, 
    currentPeriodEnd: "" 
  }))

  return <NotificationsClient plan={subscription.plan} />
}
