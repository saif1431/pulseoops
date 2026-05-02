import * as React from "react"
import { getMonitor, getMonitorStats } from "@/lib/api/monitors"
import { getIncidents } from "@/lib/api/incidents"
import { MonitorDetailClient } from "@/components/monitors/monitor-detail-client"
import { Monitor } from "@/lib/types"

export default async function MonitorDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const mockMonitor: Monitor = {
    id: id,
    name: "Marketing Website",
    url: "https://example.com",
    status: "up",
    uptime: "99.98%",
    lastChecked: "1 minute ago",
    responseTime: "145ms"
  }

  const [monitor, incidents, stats] = await Promise.all([
    getMonitor(id).catch(() => mockMonitor),
    getIncidents().catch(() => []),
    getMonitorStats(id).catch(() => ({}))
  ])

  // Filter incidents just for this monitor if real data exists
  const monitorIncidents = incidents.filter(i => i.monitorId === id)

  return <MonitorDetailClient monitor={monitor} incidents={monitorIncidents} stats={stats} />
}
