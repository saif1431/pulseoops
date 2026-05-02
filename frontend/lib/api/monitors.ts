import { apiGet, apiPost, apiPatch, apiDelete } from "../api-client";
import { Monitor } from "../types";

export async function getMonitors(): Promise<Monitor[]> {
  return apiGet<Monitor[]>("/api/monitors", ["monitors"]);
}

export async function getMonitor(id: string): Promise<Monitor> {
  return apiGet<Monitor>(`/api/monitors/${id}`);
}

export async function createMonitor(data: Partial<Monitor>): Promise<Monitor> {
  return apiPost<Monitor>("/api/monitors", data);
}

export async function updateMonitor(id: string, data: Partial<Monitor>): Promise<Monitor> {
  return apiPatch<Monitor>(`/api/monitors/${id}`, data);
}

export async function deleteMonitor(id: string): Promise<void> {
  return apiDelete<void>(`/api/monitors/${id}`);
}

export async function pauseMonitor(id: string): Promise<Monitor> {
  return apiPatch<Monitor>(`/api/monitors/${id}/pause`);
}

export async function getMonitorStats(id: string): Promise<unknown> {
  return apiGet<unknown>(`/api/monitors/${id}/stats`);
}
