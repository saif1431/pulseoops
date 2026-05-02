"use client"

import * as React from "react"
import { Download, ExternalLink, Loader2, Zap, Receipt } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge, StatusBadge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { createCheckoutSession, createPortalSession } from "@/lib/actions/billing"
import { Subscription, Invoice } from "@/lib/types"

interface BillingClientProps {
  subscription: Subscription
  invoices: Invoice[]
  monitorsUsed: number
  monitorsLimit: number
}

export function BillingClient({ subscription, invoices, monitorsUsed, monitorsLimit }: BillingClientProps) {
  const [loadingAction, setLoadingAction] = React.useState<"checkout" | "portal" | null>(null)
  const isUnlimitedMonitors = monitorsLimit === -1
  const usagePercent = isUnlimitedMonitors ? 0 : Math.min((monitorsUsed / monitorsLimit) * 100, 100)

  const handleUpgrade = async () => {
    setLoadingAction("checkout")
    try {
      await createCheckoutSession(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "price_pro")
    } catch (e) {
      console.error("Failed to start checkout", e)
      setLoadingAction(null)
    }
  }

  const handleManageBilling = async () => {
    setLoadingAction("portal")
    try {
      await createPortalSession()
    } catch (e) {
      console.error("Failed to open portal", e)
      setLoadingAction(null)
    }
  }

  const currentPlan = subscription.plan

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Billing & Usage</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your subscription, billing details, and view your current usage.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="rounded-[32px] border-line-default/50 bg-white shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-bg-base border border-line-default flex items-center justify-center text-brand-default">
                <Receipt className="h-5 w-5" />
              </div>
              <StatusBadge status={subscription.status === 'active' ? "up" : "degraded"} size="sm">
                {subscription.status}
              </StatusBadge>
            </div>
            <CardTitle className="text-xl font-bold text-text-primary">Current Plan</CardTitle>
            <CardDescription className="text-sm font-medium text-text-secondary">You are currently on the {currentPlan} plan.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 flex-1">
            <div className="text-5xl font-extrabold text-text-primary tracking-tight mb-2">
              {currentPlan === "FREE" ? "$0" : (currentPlan === "PRO" ? "$24" : "$99")}
              <span className="text-sm font-bold text-text-tertiary uppercase tracking-widest ml-2">/mo</span>
            </div>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">
              {subscription.currentPeriodEnd ? `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : 'Renews: N/A'}
            </p>
          </CardContent>
          <CardFooter className="bg-bg-base/50 border-t border-line-default/30 p-6">
            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold text-sm bg-white border-line-default hover:bg-bg-base transition-all" disabled={loadingAction !== null} onClick={handleManageBilling}>
              {loadingAction === "portal" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Billing settings &rarr;
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-[32px] border-line-default/50 bg-white shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="px-8 pt-8 pb-4">
            <div className="h-10 w-10 rounded-xl bg-bg-base border border-line-default flex items-center justify-center text-brand-default mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold text-text-primary">Resource Usage</CardTitle>
            <CardDescription className="text-sm font-medium text-text-secondary">Current cycle active monitors.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8 flex-1">
            <div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-text-tertiary mb-3">
                <span>Monitors</span>
                <span className="text-text-primary font-mono">{monitorsUsed} / {isUnlimitedMonitors ? "∞" : monitorsLimit}</span>
              </div>
              <div className="h-3 w-full bg-bg-base rounded-full overflow-hidden border border-line-default/30">
                <div 
                  className="h-full bg-brand-default rounded-full transition-all shadow-[0_0_12px_rgba(216,180,254,0.4)]" 
                  style={{ width: `${usagePercent}%` }} 
                />
              </div>
              <p className="text-[11px] text-text-tertiary mt-3 font-medium">
                {isUnlimitedMonitors
                  ? "Unlimited monitoring enabled."
                  : `Using ${Math.round(usagePercent)}% of available resources.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentPlan === "FREE" && (
        <div className="rounded-[32px] border border-brand-default/30 bg-bg-base p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Zap className="h-64 w-64 text-brand-default" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
              Unlock PulseOps Pro
              <Badge variant="brand" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1">Recommended</Badge>
            </h3>
            <p className="text-base font-medium text-text-secondary mt-3 max-w-xl leading-relaxed">
              Get 1-minute check intervals, SMS alerts, unlimited status pages, and custom domains. Perfect for growing engineering teams.
            </p>
            <Button 
              variant="primary" 
              className="mt-8 h-14 px-8 rounded-2xl font-bold text-sm bg-brand-default text-white shadow-lg shadow-brand-default/30 hover:shadow-xl hover:shadow-brand-default/40 hover:-translate-y-1 transition-all" 
              disabled={loadingAction !== null} 
              onClick={handleUpgrade}
            >
              {loadingAction === "checkout" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Upgrade now &rarr;"
              )}
            </Button>
          </div>
        </div>
      )}

      <Card className="rounded-[32px] border-line-default/50 bg-white shadow-sm overflow-hidden">
        <CardHeader className="px-8 pt-8 pb-4">
          <CardTitle className="text-xl font-bold text-text-primary">Invoice History</CardTitle>
          <CardDescription className="text-sm font-medium text-text-secondary">View and download your past billing invoices.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-bg-base/50">
                  <TableRow className="border-b border-line-default/30">
                    <TableHead className="px-8 h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Date</TableHead>
                    <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Amount</TableHead>
                    <TableHead className="h-14 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Status</TableHead>
                    <TableHead className="px-8 h-14 text-right text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-bg-base transition-colors border-b border-line-default/20 last:border-0 group">
                      <TableCell className="px-8 font-bold text-text-primary text-sm">{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono text-sm font-bold text-text-primary">{invoice.amount}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status === 'paid' ? "up" : "degraded"} size="sm">
                          {invoice.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <a href={invoice.pdfUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bg-base border border-line-default text-text-tertiary hover:text-brand-default transition-all">
                          <Download className="h-4 w-4" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-24 px-8 bg-bg-base/30">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-line-default/50 mx-auto">
                <Receipt className="h-8 w-8 text-text-tertiary opacity-80" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No invoices yet</h3>
              <p className="text-sm text-text-tertiary font-medium max-w-xs mx-auto">Your billing history will appear here once you subscribe to a paid plan.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
