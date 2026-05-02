import { apiGet, apiPost } from "../api-client";

export type StatusPageStatus = "operational" | "partial_outage" | "major_outage" | "maintenance";

export interface PublicStatusMonitor {
  id: string;
  name: string;
  status: "up" | "down" | "degraded" | "maintenance";
  uptime_percentage: number;
  category?: string;
  uptime_history: {
    date: string;
    status: "up" | "down" | "degraded" | "none";
    percentage: number;
  }[];
}

export interface PublicIncidentUpdate {
  id: string;
  message: string;
  status: string;
  created_at: string;
}

export interface PublicIncident {
  id: string;
  title: string;
  status: string;
  started_at: string;
  resolved_at?: string;
  updates: PublicIncidentUpdate[];
  monitors_affected: string[];
  duration?: string;
}

export interface PublicStatusPage {
  id: string;
  slug: string;
  title: string;
  workspace_name: string;
  workspace_logo?: string;
  overall_status: StatusPageStatus;
  last_checked: string;
  monitors: PublicStatusMonitor[];
  active_incidents: PublicIncident[];
  past_incidents: PublicIncident[];
  show_powered_by: boolean;
}

export async function getStatusPages(): Promise<PublicStatusPage[]> {
  return apiGet<PublicStatusPage[]>("/api/status-pages", ["status-pages"]);
}

export async function getPublicStatusPage(slug: string): Promise<PublicStatusPage> {
  return apiGet<PublicStatusPage>(`/api/status-pages/public/${slug}`);
}

export async function createStatusPage(data: Partial<PublicStatusPage>): Promise<PublicStatusPage> {
  return apiPost<PublicStatusPage>("/api/status-pages", data);
}

export async function subscribeToStatusPage(slug: string, email: string): Promise<{ message: string }> {
  return apiPost<{ message: string }>(`/api/status-pages/${slug}/subscribe`, { email });
}
