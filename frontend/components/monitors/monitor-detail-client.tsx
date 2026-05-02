"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Pause, Play, AlertTriangle } from "lucide-react"
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/badge"
import { StatusDot } from "@/components/ui/status-dot"
import { Monitor, Incident } from "@/lib/types"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface MonitorDetailClientProps {
  monitor: Monitor
  incidents: Incident[]
  stats: unknown
}

// Generate mock chart data since API isn't ready
const generateChartData = (hours: number) => {
  const data = []
  const now = Date.now()
  for (let i = hours; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now - i * 3600000,
      value: Math.floor(Math.random() * 150) + 50 + (Math.random() > 0.9 ? 500 : 0) // mostly 50-200, occasional spikes
    })
  }
  return data
}

// Generate mock history blocks (90 days)
const generateHistoryBlocks = () => {
  const blocks = []
  for (let i = 0; i < 90; i++) {
    const rand = Math.random()
    let status = "up"
    if (rand > 0.98) status = "down"
    else if (rand > 0.95) status = "degraded"
    
    blocks.push({
      date: new Date(Date.now() - (89 - i) * 86400000).toLocaleDateString(),
      status,
      uptime: status === "up" ? 100 : status === "degraded" ? 99.2 : 94.5
    })
  }
  return blocks
}

// Generate mock checks
const generateMockChecks = () => {
  const checks = []
  const now = Date.now()
  for (let i = 0; i < 15; i++) {
    const rand = Math.random()
    checks.push({
      id: `check-${i}`,
      time: new Date(now - i * 60000).toLocaleTimeString(),
      status: rand > 0.1 ? "up" : "down",
      responseTime: Math.floor(Math.random() * 200) + 40,
      statusCode: rand > 0.1 ? 200 : 503
    })
  }
  return checks
}

export function MonitorDetailClient({ monitor, incidents }: MonitorDetailClientProps) {
  const [timeRange, setTimeRange] = React.useState<"24h" | "7d" | "30d">("24h")
  const [paused, setPaused] = React.useState(monitor.status === "pending") // mock initial paused state
  
  const chartData = React.useMemo(() => generateChartData(timeRange === "24h" ? 24 : timeRange === "7d" ? 24 * 7 : 24 * 30), [timeRange])
  const historyBlocks = React.useMemo(() => generateHistoryBlocks(), [])
  const recentChecks = React.useMemo(() => generateMockChecks(), [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex items-center justify-between mb-2">
        <Link href="/monitors" className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to monitors
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <StatusDot status={paused ? "pending" : monitor.status} />
            <h1 className="text-2xl font-bold text-text-primary">{monitor.name}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary font-mono">
            <a href={monitor.url} target="_blank" rel="noreferrer" className="hover:text-brand-default transition-colors">{monitor.url}</a>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />} onClick={() => setPaused(!paused)}>
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="primary" leftIcon={<Edit className="h-4 w-4" />}>
            Edit monitor
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-text-secondary mb-1">Uptime (24h)</span>
            <span className="text-2xl font-bold text-text-primary">100%</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-text-secondary mb-1">Uptime (7d)</span>
            <span className="text-2xl font-bold text-text-primary">99.98%</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-text-secondary mb-1">Uptime (30d)</span>
            <span className="text-2xl font-bold text-text-primary">{monitor.uptime || "99.95%"}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-text-secondary mb-1">Avg Response</span>
            <span className="text-2xl font-bold text-text-primary">{monitor.responseTime || "120ms"}</span>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Response Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Response Time</CardTitle>
          </div>
          <div className="flex bg-bg-surface p-1 rounded-md border border-line-default shrink-0">
            {(["24h", "7d", "30d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                  timeRange === t 
                    ? "bg-bg-elevated text-text-primary shadow-sm" 
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: '#71717A' }} 
                  axisLine={false} 
                  tickLine={false} 
                  minTickGap={30}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#71717A' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `${val}ms`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)', borderRadius: '6px', color: '#09090B' }}
                  itemStyle={{ color: '#2563EB', fontWeight: 600 }}
                  labelStyle={{ color: '#71717A', fontSize: '12px', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 6, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Uptime History Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime History</CardTitle>
          <CardDescription>Last 90 days of uptime for this monitor.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 h-12 w-full mt-2">
            {historyBlocks.map((block, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-sm ${
                  block.status === "up" ? "bg-status-up hover:bg-status-up/80" : 
                  block.status === "degraded" ? "bg-status-degraded hover:bg-status-degraded/80" : 
                  "bg-status-down hover:bg-status-down/80"
                } transition-colors cursor-pointer group relative`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-sm">
                  {block.date}: {block.uptime}%
                  {/* CSS Triangle */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-900" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-text-secondary mt-2">
            <span>90 days ago</span>
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-up"></span> 100%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-degraded"></span> Degraded</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-down"></span> Outage</span>
            </span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Checks</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="text-right">Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="text-sm text-text-secondary">{check.time}</TableCell>
                      <TableCell>
                        <StatusBadge status={check.status === "up" ? "up" : "down"} size="sm" className="capitalize">
                          {check.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{check.statusCode}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{check.responseTime}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 border-t border-line-default mt-auto">
              <Button variant="ghost" className="w-full text-text-secondary">Load more checks</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Active Incidents</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {incidents.filter(i => i.status !== "resolved").length > 0 ? (
              <div className="space-y-4">
                {incidents.filter(i => i.status !== "resolved").map((incident) => (
                  <div key={incident.id} className="p-3 border border-line-default rounded-md bg-bg-surface">
                    <StatusBadge status="down" size="sm" className="mb-2">Active Incident</StatusBadge>
                    <h4 className="font-medium text-text-primary text-sm">{incident.title}</h4>
                    <p className="text-xs text-text-secondary mt-1 mb-3">{incident.timeAgo}</p>
                    <Link 
                      href={`/dashboard/incidents/${incident.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                    >
                      View updates
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center border border-dashed border-line-default rounded-lg">
                <AlertTriangle className="h-6 w-6 text-text-tertiary mb-2" />
                <p className="text-sm text-text-secondary">No active incidents for this monitor.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
