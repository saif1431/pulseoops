import { apiDelete, apiGet, apiPatch, apiPost } from "../api-client";

export interface Monitor {
  id: string;
  name: string;
  url: string;
  interval_seconds: number;
  expected_status_code: number;
  last_status: "up" | "down" | "degraded" | "pending";
  last_response_ms: number | null;
  last_checked_at: string | null;
  is_active: boolean;
  show_on_status_page: boolean;
  uptime_percentage: number | null;
  created_at: string;
}

export interface CreateMonitorInput {
  name: string;
  url: string;
  interval_seconds?: number;
  expected_status_code?: number;
  show_on_status_page?: boolean;
}

export interface UpdateMonitorInput {
  name?: string;
  url?: string;
  interval_seconds?: number;
  expected_status_code?: number;
  show_on_status_page?: boolean;
}

export const getMonitors = () => apiGet<Monitor[]>("/api/monitors/");
export const getMonitor = (id: string) => apiGet<Monitor>(`/api/monitors/${id}`);
export const createMonitor = (data: CreateMonitorInput) => apiPost<Monitor>("/api/monitors/", data);
export const updateMonitor = (id: string, data: UpdateMonitorInput) =>
  apiPatch<Monitor>(`/api/monitors/${id}`, data);
export const deleteMonitor = (id: string) => apiDelete<void>(`/api/monitors/${id}`);
export const pauseMonitor = (id: string) => apiPatch<Monitor>(`/api/monitors/${id}/pause`, {});
