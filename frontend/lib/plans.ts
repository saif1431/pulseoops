export interface PlanFeature {
  name: string
  included: boolean
}

export type PlanName = "FREE" | "PRO" | "BUSINESS"

export interface PlanLimits {
  monitors: number
  statusPages: number
  minIntervalSeconds: number
}

export const PLANS: Record<PlanName, PlanLimits> = {
  FREE: {
    monitors: 5,
    statusPages: 3,
    minIntervalSeconds: 300,
  },
  PRO: {
    monitors: 50,
    statusPages: 10,
    minIntervalSeconds: 60,
  },
  BUSINESS: {
    monitors: -1,
    statusPages: -1,
    minIntervalSeconds: 30,
  },
}

export interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  features: PlanFeature[]
  mostPopular?: boolean
  ctaText: string
  ctaHref: string
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "FREE",
    description: "Perfect for personal projects and small sites.",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaText: "Get started",
    ctaHref: "/register",
    features: [
      { name: "Up to 5 monitors", included: true },
      { name: "5-minute check intervals", included: true },
      { name: "Email alerts", included: true },
      { name: "Public status page", included: true },
      { name: "SSL monitoring", included: false },
      { name: "Multi-region checks", included: false },
    ],
  },
  {
    id: "pro",
    name: "PRO",
    description: "For professional teams requiring deep insights.",
    monthlyPrice: 29,
    annualPrice: 24,
    mostPopular: true,
    ctaText: "Start free trial",
    ctaHref: "/register?plan=pro",
    features: [
      { name: "Up to 50 monitors", included: true },
      { name: "1-minute check intervals", included: true },
      { name: "Email & SMS alerts", included: true },
      { name: "Custom domain status page", included: true },
      { name: "SSL monitoring", included: true },
      { name: "Multi-region checks", included: false },
    ],
  },
  {
    id: "business",
    name: "BUSINESS",
    description: "Advanced monitoring for mission-critical apps.",
    monthlyPrice: 99,
    annualPrice: 79,
    ctaText: "Start free trial",
    ctaHref: "/register?plan=business",
    features: [
      { name: "Unlimited monitors", included: true },
      { name: "30-second check intervals", included: true },
      { name: "All alert channels + Webhooks", included: true },
      { name: "Multiple status pages", included: true },
      { name: "SSL monitoring", included: true },
      { name: "Multi-region checks", included: true },
    ],
  },
]
