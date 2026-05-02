export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: "up" | "down" | "degraded" | "pending";
  uptime: string;
  lastChecked: string;
  responseTime: string;
}

export interface CheckResult {
  id: string;
  monitorId: string;
  status: "up" | "down" | "degraded";
  responseTime: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  monitorId: string;
  monitorName: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  title: string;
  description: string;
  timeAgo: string;
  duration: string;
  createdAt: string;
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  message: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: "FREE" | "PRO" | "BUSINESS";
  limits: {
    monitors: number;
  };
}

export interface Subscription {
  id: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "open" | "void";
  pdfUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: "FREE" | "PRO" | "BUSINESS";
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = 'ApiError';
  }
}
