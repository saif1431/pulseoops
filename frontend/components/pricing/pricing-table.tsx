"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { plans } from "@/lib/plans"
import { createCheckoutSession } from "@/lib/actions/billing"

const PRICE_IDS = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "price_pro",
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS ?? "price_business",
}

export function PricingTable() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isAnnual, setIsAnnual] = React.useState(false)
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null)

  const handleUpgrade = async (planId: "pro" | "business") => {
    if (!session) {
      router.push(`/register?plan=${planId}`)
      return
    }

    setLoadingPlan(planId)
    const priceId = PRICE_IDS[planId]
    await createCheckoutSession(priceId)
  }

  return (
    <div className="w-full">
      <div className="mb-12 flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-line-default bg-bg-subtle p-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-all",
              !isAnnual ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all",
              isAnnual ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Yearly
            <span className="bg-emerald-500/10 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
          const isPro = plan.id === "pro" || plan.id === "business"

          return (
            <Card 
              key={plan.id} 
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border-line-default/60 bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium",
                plan.mostPopular ? "ring-2 ring-brand-primary shadow-premium" : "shadow-sm"
              )}
            >
              {plan.mostPopular && (
                <div className="absolute top-8 right-8 z-20">
                  <span className="rounded-full bg-brand-primary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex h-full flex-col p-8">
                <CardHeader className="mb-8 p-0">
                  <CardTitle className="mb-2 text-2xl font-semibold tracking-tight text-text-primary">{plan.name}</CardTitle>
                  <CardDescription className="text-base leading-7 text-text-secondary">{plan.description}</CardDescription>
                </CardHeader>

                <div className="mb-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-text-primary">${price}</span>
                    <span className="text-base text-text-tertiary">/mo</span>
                  </div>
                </div>

                <div className="mb-10 flex-grow">
                  <div className="mb-5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">What&apos;s included</div>
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex gap-4 items-center">
                        <div className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          feature.included ? "bg-brand-primary text-white" : "bg-bg-subtle text-text-muted"
                        )}>
                          <Check className="h-3 w-3 stroke-[3px]" />
                        </div>
                        <span className={cn(
                          "text-sm sm:text-base",
                          feature.included ? "text-text-primary" : "text-text-tertiary/60 line-through decoration-2"
                        )}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <CardFooter className="mt-8 p-0">
                  {isPro ? (
                    <Button
                      onClick={() => handleUpgrade(plan.id as "pro" | "business")}
                      disabled={loadingPlan !== null}
                      className={cn(
                        "h-12 w-full rounded-full text-base font-semibold transition-all shadow-sm hover:shadow-md",
                        plan.mostPopular ? "btn-primary" : "btn-secondary"
                      )}
                    >
                      {loadingPlan === plan.id ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        "Get Started Free"
                      )}
                    </Button>
                  ) : (
                    <Link href={plan.ctaHref} className="w-full">
                      <Button className="btn-secondary h-12 w-full rounded-full text-base font-semibold shadow-sm hover:shadow-md">
                        {plan.ctaText}
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
