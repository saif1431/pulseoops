import * as React from "react"
import { getIncident } from "@/lib/api/incidents"
import { IncidentDetailClient } from "@/components/incidents/incident-detail-client"
import { Incident, IncidentUpdate } from "@/lib/types"

export default async function IncidentDetailPage({ params }: { params: { id: string } }) {
  // Await the entire params object before accessing id properties if needed, 
  // but Next.js 13/14 app router allows direct access. Let's make sure it's safely awaited for next.js 15+ compatibility
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const mockIncident: Incident = {
    id: id,
    monitorId: "m-1",
    monitorName: "Marketing Website",
    status: "investigating",
    title: "Brief outage during deployment",
    description: "The marketing site was temporarily unavailable.",
    timeAgo: "2 hours ago",
    duration: "14 minutes",
    createdAt: "2024-01-01T12:00:00Z"
  }

  const mockUpdates: IncidentUpdate[] = [
    {
      id: "u-1",
      incidentId: id,
      status: "investigating",
      message: "We are currently investigating the elevated error rates reported on the marketing website. We will provide another update within 15 minutes.",
      createdAt: "2024-01-01T12:00:00Z"
    },
    {
      id: "u-2",
      incidentId: id,
      status: "identified",
      message: "The issue has been identified as a misconfiguration in the recent deployment. A rollback is currently in progress.",
      createdAt: "2024-01-01T12:15:00Z"
    }
  ]

  const incident = await getIncident(id).catch(() => mockIncident)

  // If incident from API doesn't have updates embedded, we might need another API call. 
  // For mock purposes, we pass mockUpdates.
  const updates = (incident as Incident & { updates?: IncidentUpdate[] }).updates || mockUpdates

  return <IncidentDetailClient incident={incident} updates={updates} />
}
