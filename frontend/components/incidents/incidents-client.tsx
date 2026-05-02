"use client"

import * as React from "react"
import Link from "next/link"
import { Search, AlertTriangle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/badge"
import { StatusDot } from "@/components/ui/status-dot"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Incident } from "@/lib/types"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IncidentsClientProps {
  initialIncidents: Incident[]
}

export function IncidentsClient({ initialIncidents }: IncidentsClientProps) {
  const [filter, setFilter] = React.useState<"all" | "active" | "resolved">("all")
  const [search, setSearch] = React.useState("")

  const filteredIncidents = initialIncidents.filter((incident) => {
    if (filter === "active" && incident.status === "resolved") return false
    if (filter === "resolved" && incident.status !== "resolved") return false
    if (search && !incident.monitorName.toLowerCase().includes(search.toLowerCase()) && !incident.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Incidents</h1>
          <p className="text-sm text-text-secondary">Track and manage downtime events.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input 
            placeholder="Search incidents by monitor or title..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-line-default shadow-sm shrink-0 overflow-x-auto">
          {(["all", "active", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                filter === f 
                  ? "bg-brand-default text-white shadow-md" 
                  : "text-text-tertiary hover:text-text-primary hover:bg-bg-base"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="rounded-[32px] border-line-default/50 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredIncidents.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[700px]">
                <TableHeader className="bg-bg-base/50">
                  <TableRow className="border-b border-line-default/30">
                    <TableHead className="px-7 h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Status</TableHead>
                    <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Monitor</TableHead>
                    <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Incident Description</TableHead>
                    <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Started</TableHead>
                    <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Duration</TableHead>
                    <TableHead className="px-7 h-14 text-right text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id} className="hover:bg-bg-base transition-colors border-b border-line-default/20 last:border-0 group">
                      <TableCell className="px-7 py-5">
                        <StatusBadge status={incident.status === "resolved" ? "up" : "down"} size="sm">
                          {incident.status === "resolved" ? "Resolved" : "Active"}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <StatusDot status={incident.status === "resolved" ? "up" : "down"} />
                          <span className="font-bold text-text-primary text-sm group-hover:text-brand-default transition-colors">{incident.monitorName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-text-secondary text-sm font-medium">
                        {incident.title}
                      </TableCell>
                      <TableCell className="text-text-tertiary text-[11px] font-bold uppercase whitespace-nowrap">
                        {incident.timeAgo}
                      </TableCell>
                      <TableCell className="text-text-tertiary text-[11px] font-bold uppercase whitespace-nowrap">
                        {incident.duration}
                      </TableCell>
                      <TableCell className="px-7 text-right">
                        <Link 
                          href={`/incidents/${incident.id}`}
                          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-bold text-brand-default rounded-xl hover:bg-brand-default/5")}
                        >
                          Details &rarr;
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6 bg-bg-base/30">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-line-default/50">
                <AlertTriangle className="h-8 w-8 text-status-up opacity-80" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Systems Clear</h3>
              <p className="text-sm text-text-tertiary max-w-xs mx-auto font-medium">
                {filter === "all" ? "No incidents have been recorded in this workspace." : `No ${filter} incidents match your current search.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
