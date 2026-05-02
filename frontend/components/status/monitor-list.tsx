import React from "react";
import { PublicStatusMonitor } from "@/lib/api/status-pages";
import { UptimeBar } from "./uptime-bar";

interface MonitorListProps {
  monitors: PublicStatusMonitor[];
}

export function MonitorList({ monitors }: MonitorListProps) {
  // Group monitors by category
  const groupedMonitors = monitors.reduce((acc, monitor) => {
    const category = monitor.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(monitor);
    return acc;
  }, {} as Record<string, PublicStatusMonitor[]>);

  return (
    <div className="space-y-10">
      {Object.entries(groupedMonitors).map(([category, monitors]) => (
        <div key={category} className="space-y-6">
          <h2 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em] ml-2">{category}</h2>
          <div className="bg-white border border-line-default/50 rounded-[32px] overflow-hidden shadow-sm">
            {monitors.map((monitor, index) => (
              <div 
                key={monitor.id} 
                className={`p-8 ${index !== monitors.length - 1 ? 'border-b border-line-default/20' : ''} hover:bg-bg-base/30 transition-colors group`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-default transition-colors">{monitor.name}</h3>
                  <StatusPill status={monitor.status} />
                </div>
                
                <UptimeBar history={monitor.uptime_history} percentage={monitor.uptime_percentage} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const statusConfig = {
    up: { label: "Operational", bg: "bg-status-up/10", text: "text-status-up" },
    down: { label: "Outage", bg: "bg-status-down/10", text: "text-status-down" },
    degraded: { label: "Degraded", bg: "bg-status-degraded/10", text: "text-status-degraded" },
    maintenance: { label: "Maintenance", bg: "bg-brand-default/10", text: "text-brand-default" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    bg: "bg-bg-base",
    text: "text-text-tertiary",
  };

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${config.bg} ${config.text} border border-current/10`}>
      {config.label}
    </span>
  );
}
