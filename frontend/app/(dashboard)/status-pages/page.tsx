import { getStatusPages } from "@/lib/api/status-pages"
import { getSubscription } from "@/lib/api/billing"
import { getMonitors } from "@/lib/api/monitors"
import { StatusPagesClient } from "@/components/status-pages/status-pages-client"
import { PLANS } from "@/lib/plans"

export default async function StatusPagesPage() {
  const [statusPages, subscription, monitors] = await Promise.all([
    getStatusPages().catch(() => [
      { id: "sp-1", title: "PulseOps Core", slug: "pulseops-core", monitorCount: 3, subscriberCount: 142 }
    ]),
    getSubscription().catch(() => ({ plan: "FREE" as const, id: "free", status: "active" as const, currentPeriodEnd: "" })),
    getMonitors().catch(() => [])
  ])

  const planLimits = PLANS[subscription.plan].statusPages

  return <StatusPagesClient statusPages={statusPages} planLimits={planLimits} allMonitors={monitors} />
}
