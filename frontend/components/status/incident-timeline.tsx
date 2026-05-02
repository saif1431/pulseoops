import React from "react";
import { PublicIncident } from "@/lib/api/status-pages";
import { format, parseISO, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";

interface IncidentTimelineProps {
  activeIncidents: PublicIncident[];
  pastIncidents: PublicIncident[];
}

export function IncidentTimeline({ activeIncidents, pastIncidents }: IncidentTimelineProps) {
  // Group past incidents by date
  const groupedPastIncidents = pastIncidents.reduce((acc, incident) => {
    const date = format(parseISO(incident.started_at), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(incident);
    return acc;
  }, {} as Record<string, PublicIncident[]>);

  // Get last 14 days dates
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, "yyyy-MM-dd");
  });

  return (
    <div className="space-y-12">
      {/* Active Incidents */}
      {activeIncidents.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-status-down/10 flex items-center justify-center text-status-down shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            Active Incidents
          </h2>
          <div className="space-y-6">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="bg-white border border-line-default/50 rounded-[32px] shadow-sm p-8 space-y-8 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-status-down" />
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-text-primary group-hover:text-brand-default transition-colors">{incident.title}</h3>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mt-2">
                      Started {format(parseISO(incident.started_at), "MMM d, HH:mm")}
                    </p>
                  </div>
                  <span className="px-4 py-1.5 rounded-xl text-[10px] font-extrabold bg-status-down text-white uppercase tracking-widest shadow-lg shadow-status-down/20">
                    {incident.status}
                  </span>
                </div>
                
                <div className="space-y-6">
                  {incident.updates.map((update) => (
                    <div key={update.id} className="relative pl-8 pb-6 border-l-2 border-line-default/20 last:pb-0 group/update">
                      <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-line-default group-hover/update:border-brand-default transition-colors"></div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest bg-bg-base px-2 py-1 rounded-lg">{update.status}</span>
                          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{format(parseISO(update.created_at), "MMM d, HH:mm")}</span>
                        </div>
                        <p className="text-sm font-medium text-text-secondary leading-relaxed">{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Incidents */}
      <div className="space-y-10">
        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Timeline</h2>
        <div className="space-y-10">
          {last14Days.map((dateStr) => {
            const date = parseISO(dateStr);
            const incidents = groupedPastIncidents[dateStr] || [];
            const dateLabel = isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy");

            return (
              <div key={dateStr} className="space-y-6">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-text-tertiary uppercase tracking-[0.2em] min-w-[120px]">{dateLabel}</span>
                  <div className="h-px bg-border-default/30 flex-grow"></div>
                </div>
                
                {incidents.length > 0 ? (
                  <div className="space-y-8 pl-10 border-l-2 border-line-default/20 ml-4 sm:ml-[60px]">
                    {incidents.map((incident) => (
                      <div key={incident.id} className="space-y-3 group/past">
                        <h3 className="text-lg font-bold text-text-primary group-hover/past:text-brand-default transition-colors">{incident.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                          <span className="bg-bg-base px-2 py-1 rounded-lg border border-line-default/50">{incident.monitors_affected.join(", ")}</span>
                          <span className="opacity-30">•</span>
                          <span>{incident.duration}</span>
                          <span className="opacity-30">•</span>
                          <span className="text-status-up">Resolved</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] font-bold uppercase tracking-widest text-status-up bg-status-up/5 py-2.5 px-6 rounded-2xl inline-block ml-4 sm:ml-[60px] border border-status-up/10">
                    No incidents reported.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
