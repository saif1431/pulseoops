"use client"

import * as React from "react"
import { toast } from "sonner"
import { Search, Activity, Pause, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { AddMonitorModal } from "@/components/monitors/add-monitor-modal"
import { Card, CardContent } from "@/components/ui/card"
import { StatusDot } from "@/components/ui/status-dot"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Monitor } from "@/lib/types"
import { deleteMonitor, pauseMonitor } from "@/lib/api/monitors"
import { Button } from "@/components/ui/button"

interface MonitorsClientProps {
  monitors: Monitor[]
  plan: "FREE" | "PRO" | "BUSINESS"
  planLimits: number
}

export function MonitorsClient({ monitors: initialMonitors, plan, planLimits }: MonitorsClientProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState<string | null>(null)
  const [monitors, setMonitors] = React.useState(initialMonitors)
  const atMonitorLimit = planLimits !== -1 && monitors.length >= planLimits

  // Sync with server data on prop change
  React.useEffect(() => { setMonitors(initialMonitors) }, [initialMonitors])

  const filteredMonitors = monitors.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.url.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this monitor?")) return
    // Optimistic: remove immediately
    const prev = monitors
    setMonitors(monitors.filter(m => m.id !== id))
    setLoading(id)
    try {
      await deleteMonitor(id)
      toast.success("Monitor deleted successfully.")
      router.refresh()
    } catch (e) {
      console.error("Failed to delete", e)
      setMonitors(prev) // rollback
      toast.error("Failed to delete monitor. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const handlePause = async (id: string) => {
    // Optimistic: toggle status
    const prev = monitors
    setMonitors(monitors.map(m => m.id === id ? { ...m, status: m.status === 'pending' ? 'up' as const : 'pending' as const } : m))
    setLoading(id)
    try {
      await pauseMonitor(id)
      toast.success("Monitor paused.")
      router.refresh()
    } catch (e) {
      console.error("Failed to pause", e)
      setMonitors(prev) // rollback
      toast.error("Failed to pause monitor. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Monitors</h1>
          <p className="text-sm text-text-secondary">
            Manage your uptime checks. {planLimits === -1 ? `${monitors.length} used` : `${monitors.length}/${planLimits} used`}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddMonitorModal onSuccess={() => router.refresh()} currentCount={monitors.length} />
          {atMonitorLimit && plan === "FREE" && (
            <Button variant="outline" onClick={() => router.push('/pricing')}>
              Upgrade
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input 
            placeholder="Search monitors..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="h-10 rounded-md border border-line-default bg-bg-surface px-3 py-2 text-sm text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-focus">
            <option value="all">All Status</option>
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="degraded">Degraded</option>
          </select>
          <select className="h-10 rounded-md border border-line-default bg-bg-surface px-3 py-2 text-sm text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-focus">
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="uptime">Sort by Uptime</option>
          </select>
        </div>
      </div>

      {filteredMonitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-line-default rounded-[32px] bg-white text-center">
          <div className="h-16 w-16 rounded-2xl bg-bg-base flex items-center justify-center mb-6 border border-line-default shadow-sm">
            <Activity className="h-8 w-8 text-brand-default opacity-80" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No monitors found</h3>
          <p className="text-sm text-text-tertiary mb-8 max-w-sm">Start tracking your website's uptime by adding your first monitor.</p>
          <AddMonitorModal onSuccess={() => router.refresh()} currentCount={monitors.length} />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMonitors.map((monitor) => (
            <Card key={monitor.id} className="flex flex-col rounded-[24px] border-line-default/50 bg-white hover:border-brand-default/40 transition-all hover:-translate-y-1 hover:shadow-lg group">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4 overflow-hidden">
                    <div className="mt-1 shrink-0">
                      <StatusDot status={monitor.status} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-text-primary truncate text-lg group-hover:text-brand-default transition-colors">{monitor.name}</h3>
                      <p className="text-[11px] text-text-tertiary truncate mt-1 font-mono">{monitor.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handlePause(monitor.id)}
                      disabled={loading === monitor.id}
                      className="text-text-tertiary hover:text-text-primary transition-colors shrink-0 p-2 rounded-xl hover:bg-bg-base border border-transparent hover:border-line-default"
                      title="Pause Monitor"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(monitor.id)}
                      disabled={loading === monitor.id}
                      className="text-text-tertiary hover:text-status-down transition-colors shrink-0 p-2 rounded-xl hover:bg-status-down/5 border border-transparent hover:border-status-down/10"
                      title="Delete Monitor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-text-tertiary mb-2">
                      <span>Uptime (30d)</span>
                      <span className="font-mono text-text-primary">{monitor.uptime || "N/A"}</span>
                    </div>
                    <div className="h-2 w-full bg-bg-base rounded-full overflow-hidden border border-line-default/30">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          monitor.status === "up" ? "bg-status-up shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-status-degraded shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                        )} 
                        style={{ width: monitor.uptime || "0%" }} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-bg-base/50 rounded-2xl p-4 border border-line-default/30">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-text-tertiary mb-3">
                      <span>Response Time</span>
                      <span className="font-mono text-text-primary">{monitor.responseTime || "N/A"}</span>
                    </div>
                    {/* Placeholder sparkline */}
                    <div className="h-10 w-full flex items-end gap-1.5 px-1">
                      {[40, 35, 45, 50, 42, 38, 45, 55, 48, 60, 45, 40, 48, 52, 45].map((h, i) => (
                        <div key={i} className="flex-1 bg-brand-default/30 rounded-t-[2px] hover:bg-brand-default transition-colors" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-line-default/30 flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                    Checked {monitor.lastChecked || "never"}
                  </div>
                  <Badge variant="neutral" size="sm" className="font-mono bg-bg-base border-line-default/50 text-text-secondary rounded-lg px-2 py-0.5">1m</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
