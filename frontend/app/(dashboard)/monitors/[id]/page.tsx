import * as React from "react"
import { getMonitor, type Monitor } from "@/lib/api/monitors"
import { getIncidents } from "@/lib/api/incidents"
import { MonitorDetailClient } from "@/components/monitors/monitor-detail-client"

export default async function MonitorDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const mockMonitor: Monitor = {
    id: id,
    name: "Marketing Website",
    url: "https://example.com",
    interval_seconds: 300,
    expected_status_code: 200,
    last_status: "up",
    last_response_ms: 145,
    last_checked_at: new Date().toISOString(),
    is_active: true,
    show_on_status_page: true,
    uptime_percentage: 99.98,
    created_at: new Date().toISOString(),
  }

  const [monitor, incidents] = await Promise.all([
    getMonitor(id).catch(() => mockMonitor),
    getIncidents().catch(() => []),
  ])

  // Filter incidents just for this monitor if real data exists
  const monitorIncidents = incidents.filter(i => i.monitorId === id)

  return <MonitorDetailClient monitor={monitor} incidents={monitorIncidents} stats={{}} />
}
