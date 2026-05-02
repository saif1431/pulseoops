import { apiGet, apiPost } from "../api-client";
import { Subscription, Invoice } from "../types";

export async function getSubscription(): Promise<Subscription> {
  return apiGet<Subscription>("/api/billing/subscription", ["subscription"]);
}

export async function createCheckoutSession(priceId: string): Promise<{ url: string }> {
  return apiPost<{ url: string }>("/api/billing/checkout", { priceId });
}

export async function createPortalSession(): Promise<{ url: string }> {
  return apiPost<{ url: string }>("/api/billing/portal");
}

export async function getInvoices(): Promise<Invoice[]> {
  return apiGet<Invoice[]>("/api/billing/invoices", ["invoices"]);
}
