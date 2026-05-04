import * as React from "react"
import { getPublicStatusPage } from "@/lib/api/status-pages"
import { getMonitors } from "@/lib/api/monitors"
import { StatusPageEditClient } from "@/components/status-pages/status-page-edit-client"

export default async function StatusPageEditPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [statusPage, monitors] = await Promise.all([
    getPublicStatusPage(id).catch(() => ({ 
      id, 
      title: "PulseOps Core", 
      slug: "pulseops-core" 
    })),
    getMonitors().catch(() => [
      {
        id: "1",
        name: "Marketing Website",
        url: "https://example.com",
        interval_seconds: 300,
        expected_status_code: 200,
        last_status: "up" as const,
        last_response_ms: 120,
        last_checked_at: new Date().toISOString(),
        is_active: true,
        show_on_status_page: true,
        uptime_percentage: 100,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "API Gateway",
        url: "https://api.example.com",
        interval_seconds: 300,
        expected_status_code: 200,
        last_status: "up" as const,
        last_response_ms: 340,
        last_checked_at: new Date().toISOString(),
        is_active: true,
        show_on_status_page: true,
        uptime_percentage: 99.95,
        created_at: new Date().toISOString(),
      },
    ])
  ])

  return <StatusPageEditClient statusPage={statusPage} allMonitors={monitors} />
}
