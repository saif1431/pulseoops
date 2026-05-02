import * as React from "react"
import { getIncidents } from "@/lib/api/incidents"
import { IncidentsClient } from "@/components/incidents/incidents-client"
import { Incident } from "@/lib/types"

const mockIncidents: Incident[] = [
  {
    id: "inc-1",
    monitorId: "m-1",
    monitorName: "Marketing Website",
    status: "resolved",
    title: "Brief outage during deployment",
    description: "The marketing site was temporarily unavailable.",
    timeAgo: "2 hours ago",
    duration: "14 minutes",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "inc-2",
    monitorId: "m-4",
    monitorName: "Background Workers",
    status: "investigating",
    title: "Elevated error rates",
    description: "We are seeing elevated error rates in job processing.",
    timeAgo: "15 minutes ago",
    duration: "Ongoing",
    createdAt: new Date(Date.now() - 900000).toISOString()
  }
]

export default async function IncidentsPage() {
  const incidents = await getIncidents().catch(() => mockIncidents)

  return <IncidentsClient initialIncidents={incidents} />
}
