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
      { id: "1", name: "Marketing Website", url: "https://example.com", status: "up" as const, uptime: "100%", lastChecked: "1 min ago", responseTime: "120ms" },
      { id: "2", name: "API Gateway", url: "api.example.com", status: "up" as const, uptime: "99.95%", lastChecked: "1 min ago", responseTime: "340ms" },
    ])
  ])

  return <StatusPageEditClient statusPage={statusPage} allMonitors={monitors} />
}
