"use client"

import * as React from "react"
import { Mail, Hash, Webhook, Lock, Clock, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { UpgradePrompt } from "@/components/billing/upgrade-prompt"

interface NotificationsClientProps {
  plan: "FREE" | "PRO" | "BUSINESS"
}

export function NotificationsClient({ plan }: NotificationsClientProps) {
  const isPro = plan !== "FREE"
  const [email] = React.useState("john@example.com")
  const [loading, setLoading] = React.useState(false)

  const handleSave = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Notification settings saved")
    }, 800)
  }

  const handleTest = (channel: string) => {
    toast.info(`Test alert sent to ${channel}`)
  }

  return (
    <div className="space-y-8 pb-10">
      <Card>
        <CardHeader>
          <CardTitle>Alert Channels</CardTitle>
          <CardDescription>Choose where you want to receive downtime notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border border-line-default bg-bg-surface">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-brand-subtle flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-brand-default" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">Email Notifications</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">{email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="ghost" size="sm" onClick={() => handleTest("email")}>Test</Button>
              <div className="h-6 w-11 bg-brand-default rounded-full relative cursor-pointer ml-2">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Slack */}
          <div className={cn(
            "flex flex-col gap-4 p-4 rounded-lg border transition-all",
            isPro ? "border-line-default bg-bg-surface" : "border-dashed border-line-default opacity-80"
          )}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                  isPro ? "bg-[#4A154B]/10" : "bg-bg-base"
                )}>
                  <Hash className={cn("h-5 w-5", isPro ? "text-[#4A154B]" : "text-text-tertiary")} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">Slack Alerts</p>
                    {!isPro && <Badge className="bg-brand-default/10 text-brand-default border-none text-[10px] py-0">PRO+</Badge>}
                  </div>
                  <p className="text-xs text-text-secondary">Send alerts to a Slack channel via webhooks.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isPro ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleTest("Slack")}>Test</Button>
                    <div className="h-6 w-11 bg-bg-base rounded-full relative cursor-pointer ml-2 border border-line-default">
                      <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm border border-line-default" />
                    </div>
                  </>
                ) : (
                  <Button variant="outline" size="sm" leftIcon={<Lock className="h-3 w-3" />} onClick={() => window.location.assign("/pricing")}>Upgrade</Button>
                )}
              </div>
            </div>
            {isPro && (
              <div className="pt-2 animate-in slide-in-from-top-2 duration-300">
                <Input placeholder="https://hooks.slack.com/services/..." label="Webhook URL" />
              </div>
            )}
            {!isPro && <UpgradePrompt feature="Slack alerts" requiredPlan="PRO" />}
          </div>

          {/* Webhooks */}
          <div className={cn(
            "flex flex-col gap-4 p-4 rounded-lg border transition-all",
            isPro ? "border-line-default bg-bg-surface" : "border-dashed border-line-default opacity-80"
          )}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                  isPro ? "bg-status-up/10" : "bg-bg-base"
                )}>
                  <Webhook className={cn("h-5 w-5", isPro ? "text-status-up" : "text-text-tertiary")} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">Webhooks</p>
                    {!isPro && <Badge className="bg-brand-default/10 text-brand-default border-none text-[10px] py-0">PRO+</Badge>}
                  </div>
                  <p className="text-xs text-text-secondary">Integrate with your own API or third-party services.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isPro ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleTest("Webhook")}>Test</Button>
                    <div className="h-6 w-11 bg-bg-base rounded-full relative cursor-pointer ml-2 border border-line-default">
                      <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm border border-line-default" />
                    </div>
                  </>
                ) : (
                  <Button variant="outline" size="sm" leftIcon={<Lock className="h-3 w-3" />} onClick={() => window.location.assign("/pricing")}>Upgrade</Button>
                )}
              </div>
            </div>
            {!isPro && <UpgradePrompt feature="Webhook notifications" requiredPlan="PRO" />}
          </div>
        </CardContent>
      </Card>

      {/* Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>Fine-tune when and how you get notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-brand-default" />
                <label className="text-sm font-medium text-text-primary">Failure Threshold</label>
              </div>
              <div className="flex items-center gap-3">
                <Input type="number" defaultValue="2" className="w-20" />
                <span className="text-sm text-text-secondary">consecutive failures</span>
              </div>
              <p className="text-xs text-text-secondary">Prevents false alerts from temporary network blips.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-default" />
                <label className="text-sm font-medium text-text-primary">SSL Expiry Warning</label>
              </div>
              <div className="flex items-center gap-3">
                <Input type="number" defaultValue="14" className="w-20" />
                <span className="text-sm text-text-secondary">days before</span>
              </div>
              <p className="text-xs text-text-secondary">Notify before your SSL certificate expires.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-line-default/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1 text-left">
                <p className="text-sm font-medium text-text-primary">Recovery Notification</p>
                <p className="text-xs text-text-secondary">Send an alert when a monitor comes back online.</p>
              </div>
              <div className="h-6 w-11 bg-brand-default rounded-full relative cursor-pointer ml-2">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className={cn(!isPro && "opacity-80")}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notification Schedule</CardTitle>
              <CardDescription>Only receive alerts during specific hours.</CardDescription>
            </div>
            {!isPro && <Badge className="bg-brand-default/10 text-brand-default border-none">PRO+</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left">
              <p className="text-sm font-medium text-text-primary">Only alert during business hours</p>
              <p className="text-xs text-text-secondary">Silence notifications outside your working window.</p>
            </div>
            <div className={cn(
              "h-6 w-11 rounded-full relative cursor-pointer ml-2 border",
              isPro ? "bg-bg-base border-line-default" : "bg-bg-base border-line-default opacity-50 cursor-not-allowed"
            )}>
              <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm border border-line-default" />
            </div>
          </div>

          {isPro && (
            <div className="grid sm:grid-cols-2 gap-6 pt-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary leading-none">Timezone</label>
                <select className="flex h-9 w-full rounded-md border border-line-default bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:border-border-focus focus-visible:ring-brand-focus focus-visible:shadow-[0_0_0_3px_rgba(37,99,235,0.3)]">
                  <option className="bg-bg-surface text-text-primary">(GMT+05:00) Islamabad, Karachi</option>
                  <option className="bg-bg-surface text-text-primary">(GMT+00:00) London</option>
                  <option className="bg-bg-surface text-text-primary">(GMT-05:00) New York</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary leading-none">From</label>
                  <Input type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary leading-none">To</label>
                  <Input type="time" defaultValue="18:00" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-0 bg-bg-base/80 backdrop-blur-md py-4 border-t border-line-default -mx-4 px-4 z-10">
        <Button variant="primary" loading={loading} onClick={handleSave}>Save all notification settings</Button>
      </div>
    </div>
  )
}
