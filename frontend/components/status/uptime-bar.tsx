import React from "react";
import { format, parseISO } from "date-fns";

interface UptimeBarProps {
  history: {
    date: string;
    status: "up" | "down" | "degraded" | "none";
    percentage: number;
  }[];
  percentage: number;
}

export function UptimeBar({ history, percentage }: UptimeBarProps) {
  // Ensure we have exactly 90 days of history, padding if necessary
  const paddedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div className="space-y-2">
      <div className="flex gap-[3px] h-10">
        {paddedHistory.map((day, i) => (
          <div
            key={i}
            className={`flex-grow rounded-[2px] group relative transition-all hover:scale-y-125 hover:z-20 ${getStatusColor(day.status)}`}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-30">
              <div className="bg-text-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-2xl uppercase tracking-widest">
                <span className="opacity-80">{format(parseISO(day.date), "MMM d")}</span>
                <span className="mx-2 text-white/30">|</span>
                <span>{day.percentage}%</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-text-primary"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] text-text-tertiary font-bold uppercase tracking-[0.15em] pt-2">
        <span>90 days ago</span>
        <div className="h-px flex-1 mx-4 bg-border-default/30" />
        <span className="text-text-secondary font-extrabold">{percentage}% uptime</span>
        <div className="h-px flex-1 mx-4 bg-border-default/30" />
        <span>Today</span>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "up":
      return "bg-status-up hover:shadow-[0_0_8px_rgba(34,197,94,0.6)]";
    case "degraded":
      return "bg-status-degraded hover:shadow-[0_0_8px_rgba(249,115,22,0.6)]";
    case "down":
      return "bg-status-down hover:shadow-[0_0_8px_rgba(239,68,68,0.6)]";
    case "none":
    default:
      return "bg-bg-base hover:bg-border-default/30";
  }
}
