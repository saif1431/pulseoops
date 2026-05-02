"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Clock, MessageSquare, CheckCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/badge"
import { StatusDot } from "@/components/ui/status-dot"
import { Incident, IncidentUpdate } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface IncidentDetailClientProps {
  incident: Incident
  updates: IncidentUpdate[]
}

export function IncidentDetailClient({ incident, updates }: IncidentDetailClientProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <Link href="/incidents" className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to incidents
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <StatusDot status={incident.status === "resolved" ? "up" : "down"} />
            <h1 className="text-2xl font-bold text-text-primary">{incident.title}</h1>
            <StatusBadge status={incident.status === "resolved" ? "up" : "down"} size="sm">
              {incident.status === "resolved" ? "Resolved" : "Active"}
            </StatusBadge>
          </div>
          <p className="text-sm text-text-secondary flex items-center gap-2">
            Affected monitor: <span className="font-medium text-text-primary">{incident.monitorName}</span>
          </p>
        </div>
        
        {incident.status !== "resolved" && (
          <div className="flex gap-2">
            <Button variant="primary" leftIcon={<CheckCircle className="h-4 w-4" />}>
              Resolve incident
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-text-secondary mb-1 flex items-center"><Clock className="mr-1 h-3 w-3" /> Started at</span>
            <span className="font-medium text-text-primary">{new Date(incident.createdAt).toLocaleString()}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-text-secondary mb-1 flex items-center"><Clock className="mr-1 h-3 w-3" /> Duration</span>
            <span className="font-medium text-text-primary">{incident.duration}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Timeline Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length > 0 ? (
            <div className="relative border-l border-line-default ml-3 space-y-8 pb-4">
              {updates.map((update) => (
                <div key={update.id} className="relative pl-6">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-brand-default ring-4 ring-bg-surface" />
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status="up" size="sm" className="capitalize">{update.status}</StatusBadge>
                      <span className="text-xs text-text-tertiary">{new Date(update.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-sm text-text-primary bg-bg-subtle p-3 rounded-md border border-line-default">
                    {update.message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center border-t border-line-default mt-2">
              <MessageSquare className="h-8 w-8 text-text-tertiary mb-3 opacity-50" />
              <h3 className="text-sm font-medium text-text-primary">No updates posted yet</h3>
              <p className="text-sm text-text-secondary mt-1">This incident doesn&apos;t have a timeline history.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
