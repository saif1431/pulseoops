import * as React from "react"
import Link from "next/link"
import { Activity, Clock, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatusDot } from "@/components/ui/status-dot"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/badge"
import { AddMonitorModal } from "@/components/monitors/add-monitor-modal"
import { getMonitors } from "@/lib/api/monitors"
import { getIncidents } from "@/lib/api/incidents"
import { AnimatedStatValue } from "@/components/dashboard/animated-stat"
import { CheckoutSuccessFeedback } from "@/components/dashboard/checkout-success-feedback"
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist"
import { createMonitorAction } from "../monitors/actions"

export default async function DashboardHomePage() {
  const [monitors, incidents] = await Promise.all([
    getMonitors().catch(() => []),
    getIncidents().catch(() => [])
  ])

  const activeMonitors = monitors.filter((m) => m.is_active).length
  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length
  
  const totalUptime = monitors.length > 0 
    ? monitors.reduce((acc, m) => acc + (m.uptime_percentage ?? 0), 0) / monitors.length
    : 100
    
  const avgResponseTime = monitors.length > 0
    ? Math.round(monitors.reduce((acc, m) => acc + (m.last_response_ms ?? 0), 0) / monitors.length)
    : 0

  const stats = [
    { title: "Total monitors", value: `${monitors.length}`, subtext: `${activeMonitors} active`, icon: Activity },
    { title: "Overall uptime", value: `${totalUptime.toFixed(2)}%`, subtext: "Last 30 days", icon: Clock },
    { title: "Active incidents", value: `${activeIncidents}`, subtext: activeIncidents === 0 ? "All systems operational" : `${activeIncidents} require attention`, icon: AlertTriangle, status: activeIncidents === 0 ? "good" : "bad" },
    { title: "Avg response time", value: `${avgResponseTime}ms`, subtext: "Across all monitors", icon: Activity },
  ]

  const recentMonitors = monitors.slice(0, 5)
  const recentIncidents = incidents.slice(0, 3)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CheckoutSuccessFeedback />
      
      {monitors.length === 0 && (
        <OnboardingChecklist monitorCount={monitors.length} />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Overview</h1>
          <p className="text-sm text-text-secondary">
            A summary of your monitoring infrastructure.{" "}
            <span className="text-text-tertiary">
              {monitors.length} monitors • {activeIncidents} active incidents
            </span>
          </p>
        </div>
        <AddMonitorModal currentCount={monitors.length} createAction={createMonitorAction} />
      </div>

      <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-3xl border-line-default/50 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <CardContent className="p-5 sm:p-7">
              <div className="flex items-center justify-between pb-3">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-text-tertiary truncate pr-2">{stat.title}</p>
                <div className="h-8 w-8 rounded-xl bg-bg-base border border-line-default flex items-center justify-center text-brand-default">
                  <stat.icon className="h-4 w-4 shrink-0" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                  <AnimatedStatValue value={stat.value} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-[11px] sm:text-xs text-text-secondary font-medium">{stat.subtext}</p>
                {stat.status === "good" ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-status-up shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                ) : stat.status === "bad" ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-status-down shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 flex flex-col min-w-0 rounded-3xl border-line-default/50 bg-white shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-7 py-6 bg-white border-b border-line-default/30">
            <div>
              <CardTitle className="text-lg font-bold">Recent Monitors</CardTitle>
            </div>
            <Link href="/monitors" className="text-sm font-bold text-brand-default flex items-center hover:opacity-80 transition-opacity">
              Explore all <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[500px]">
                <TableHeader className="bg-bg-base/50">
                  <TableRow className="border-b border-line-default/30">
                    <TableHead className="w-16 px-7 h-12 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Live</TableHead>
                    <TableHead className="h-12 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Resource</TableHead>
                    <TableHead className="text-right h-12 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Uptime</TableHead>
                    <TableHead className="text-right px-7 h-12 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">MS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMonitors.length > 0 ? (
                    recentMonitors.map((monitor) => (
                      <TableRow key={monitor.id} className="hover:bg-bg-base transition-colors border-b border-line-default/20 last:border-0 group">
                        <TableCell className="w-16 px-7 text-center">
                          <StatusDot status={monitor.last_status} />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-bold text-text-primary text-sm group-hover:text-brand-default transition-colors">{monitor.name}</div>
                          <div className="text-[11px] text-text-tertiary truncate max-w-[120px] sm:max-w-xs font-mono mt-0.5">{monitor.url}</div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-bold text-text-primary">
                          {monitor.uptime_percentage != null ? `${monitor.uptime_percentage.toFixed(2)}%` : "N/A"}
                        </TableCell>
                        <TableCell className="text-right px-7 font-mono text-sm text-text-tertiary">
                          {monitor.last_response_ms != null ? `${monitor.last_response_ms}ms` : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-text-tertiary font-medium">
                        No active monitors found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 flex flex-col rounded-3xl border-line-default/50 bg-white shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-7 py-6 bg-white border-b border-line-default/30">
            <div>
              <CardTitle className="text-lg font-bold">Recent Incidents</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 px-7 py-6 flex flex-col">
            {recentIncidents.length > 0 ? (
              <div className="space-y-6">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex flex-col gap-2 border-b border-line-default/30 pb-5 last:border-0 last:pb-0 group">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={incident.status === 'resolved' ? "up" : "down"} size="sm">
                        {incident.status === 'resolved' ? "Resolved" : "Ongoing"}
                      </StatusBadge>
                      <span className="text-[11px] font-bold text-text-tertiary uppercase">{incident.timeAgo}</span>
                    </div>
                    <div className="text-sm font-bold text-text-primary mt-1 group-hover:text-brand-default transition-colors">{incident.monitorName}</div>
                    <div className="text-[11px] text-text-tertiary font-medium">Duration: {incident.duration}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center bg-bg-base rounded-2xl border border-line-default/50">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 border border-line-default/50">
                  <CheckCircle className="h-7 w-7 text-status-up opacity-80" />
                </div>
                <h3 className="text-sm font-bold text-text-primary tracking-tight">System Healthy</h3>
                <p className="text-[11px] text-text-tertiary mt-1 font-medium">No recent incidents detected.</p>
              </div>
            )}
            
            <div className="mt-8 border-t border-line-default/30 pt-6">
              <Link href="/incidents" className="text-xs font-bold text-brand-default flex items-center justify-center hover:opacity-80 transition-opacity">
                Review all incidents &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
