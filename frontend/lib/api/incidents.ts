import { apiGet, apiPost, apiPatch } from "../api-client";
import { Incident, IncidentUpdate } from "../types";

export async function getIncidents(): Promise<Incident[]> {
  return apiGet<Incident[]>("/api/incidents", ["incidents"]);
}

export async function getIncident(id: string): Promise<Incident> {
  return apiGet<Incident>(`/api/incidents/${id}`);
}

export async function createIncidentUpdate(id: string, data: Partial<IncidentUpdate>): Promise<IncidentUpdate> {
  return apiPost<IncidentUpdate>(`/api/incidents/${id}/updates`, data);
}

export async function resolveIncident(id: string): Promise<Incident> {
  return apiPatch<Incident>(`/api/incidents/${id}/resolve`);
}
