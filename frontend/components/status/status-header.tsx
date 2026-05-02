import React from "react";
import { StatusPageStatus } from "@/lib/api/status-pages";
import { CheckCircle2, AlertTriangle, XCircle, Info, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StatusHeaderProps {
  title: string;
  workspaceLogo?: string;
  overallStatus: StatusPageStatus;
  lastChecked: string;
  workspaceName: string;
}

const statusConfig = {
  operational: {
    label: "All systems operational",
    icon: CheckCircle2,
    bg: "bg-status-up shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    text: "text-white",
  },
  partial_outage: {
    label: "Partial system outage",
    icon: AlertTriangle,
    bg: "bg-status-degraded shadow-[0_0_20px_rgba(249,115,22,0.3)]",
    text: "text-white",
  },
  major_outage: {
    label: "Major outage in progress",
    icon: XCircle,
    bg: "bg-status-down shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    text: "text-white",
  },
  maintenance: {
    label: "Maintenance in progress",
    icon: Info,
    bg: "bg-brand-default shadow-[0_0_20px_rgba(216,180,254,0.3)]",
    text: "text-white",
  },
};

export function StatusHeader({ title, workspaceLogo, overallStatus, lastChecked, workspaceName }: StatusHeaderProps) {
  const config = statusConfig[overallStatus];
  const Icon = config.icon;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-5">
        {workspaceLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={workspaceLogo} alt={workspaceName} className="w-16 h-16 rounded-2xl object-contain bg-white p-2 border border-line-default shadow-sm" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-brand-default flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-default/20">
            {workspaceName.charAt(0).toUpperCase()}
          </div>
        ) as React.ReactNode}
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{title}</h1>
      </div>

      <div className={`${config.bg} ${config.text} p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all duration-500`}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0,transparent_50%)] pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Icon className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold tracking-tight">{config.label}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest bg-black/10 px-5 py-2.5 rounded-2xl backdrop-blur-sm relative z-10">
          <Clock className="w-4 h-4" />
          <span>Updated {formatDistanceToNow(new Date(lastChecked))} ago</span>
        </div>
      </div>
    </div>
  );
}
