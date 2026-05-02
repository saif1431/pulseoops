import * as React from "react"
import { getSubscription, getInvoices } from "@/lib/api/billing"
import { getMonitors } from "@/lib/api/monitors"
import { BillingClient } from "@/components/billing/billing-client"
import { PLANS } from "@/lib/plans"

export default async function BillingPage() {
  const [subscription, invoices, monitors] = await Promise.all([
    getSubscription().catch(() => ({ 
      id: "free", 
      plan: "FREE" as const, 
      status: "active" as const, 
      currentPeriodEnd: "" 
    })),
    getInvoices().catch(() => []),
    getMonitors().catch(() => [])
  ])

  const planLimits = PLANS[subscription.plan].monitors
  const monitorsUsed = monitors.length

  return (
    <BillingClient 
      subscription={subscription} 
      invoices={invoices} 
      monitorsUsed={monitorsUsed} 
      monitorsLimit={planLimits} 
    />
  )
}
