import * as React from "react"
import { getMonitors } from "@/lib/api/monitors"
import { getSubscription } from "@/lib/api/billing"
import { MonitorsClient } from "@/components/monitors/monitors-client"
import { PLANS } from "@/lib/plans"
import {
  createMonitorAction,
  deleteMonitorAction,
  pauseMonitorAction,
  updateMonitorAction,
} from "./actions"

export default async function MonitorsPage() {
  const [monitors, subscription] = await Promise.all([
    getMonitors().catch(() => []),
    getSubscription().catch(() => ({ plan: "FREE" as const, id: "free", status: "active" as const, currentPeriodEnd: "" }))
  ])

  const planLimits = PLANS[subscription.plan].monitors

  return (
    <MonitorsClient
      monitors={monitors}
      plan={subscription.plan}
      planLimits={planLimits}
      createAction={createMonitorAction}
      deleteAction={deleteMonitorAction}
      pauseAction={pauseMonitorAction}
      updateAction={updateMonitorAction}
    />
  )
}
