"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Circle, Activity, Bell, Globe, CreditCard, ChevronDown, ChevronUp, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ChecklistItem {
  id: string
  label: string
  description: string
  href: string
  icon: React.ElementType
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "monitor",
    label: "Add your first monitor",
    description: "Start tracking uptime by creating a URL monitor.",
    href: "/monitors",
    icon: Activity,
  },
  {
    id: "alert",
    label: "Configure alert channels",
    description: "Set up email, Slack, or webhook notifications.",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    id: "status-page",
    label: "Create a status page",
    description: "Publish a public status page for your customers.",
    href: "/status-pages",
    icon: Globe,
  },
  {
    id: "billing",
    label: "Explore plans",
    description: "Unlock more monitors, team members, and integrations.",
    href: "/pricing",
    icon: CreditCard,
  },
]

const STORAGE_KEY = "pulseops_onboarding"

interface OnboardingState {
  dismissed: boolean
  completed: string[]
}

function getStoredState(): OnboardingState {
  if (typeof window === "undefined") return { dismissed: false, completed: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return { dismissed: false, completed: [] }
}

function storeState(state: OnboardingState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

interface OnboardingChecklistProps {
  monitorCount?: number
}

export function OnboardingChecklist({ monitorCount = 0 }: OnboardingChecklistProps) {
  const [state, setState] = React.useState<OnboardingState>({ dismissed: false, completed: [] })
  const [collapsed, setCollapsed] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const stored = getStoredState()
    // Auto-complete "monitor" step if monitors exist
    if (monitorCount > 0 && !stored.completed.includes("monitor")) {
      stored.completed = [...stored.completed, "monitor"]
      storeState(stored)
    }
    setState(stored)
    setMounted(true)
  }, [monitorCount])

  if (!mounted || state.dismissed) return null

  const completedCount = state.completed.length
  const totalCount = CHECKLIST_ITEMS.length
  const progress = Math.round((completedCount / totalCount) * 100)

  if (completedCount === totalCount) return null

  const toggleItem = (id: string) => {
    const next = state.completed.includes(id)
      ? { ...state, completed: state.completed.filter((c) => c !== id) }
      : { ...state, completed: [...state.completed, id] }
    setState(next)
    storeState(next)
  }

  const dismiss = () => {
    const next = { ...state, dismissed: true }
    setState(next)
    storeState(next)
  }

  return (
    <Card className="border-brand-default/20 bg-gradient-to-br from-brand-default/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-default/10">
              <Activity className="h-5 w-5 text-brand-default" />
            </div>
            <div>
              <CardTitle className="text-base">Getting Started</CardTitle>
              <CardDescription>
                {completedCount}/{totalCount} completed — set up your reliability workflow
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-subtle transition-colors"
            >
              {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-subtle transition-colors"
              title="Dismiss checklist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-default transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-2 pt-0">
          {CHECKLIST_ITEMS.map((item) => {
            const done = state.completed.includes(item.id)
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                  done
                    ? "border-line-default/50 bg-bg-subtle/50"
                    : "border-line-default bg-bg-surface hover:bg-bg-subtle"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="mt-0.5 shrink-0"
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-status-up" />
                  ) : (
                    <Circle className="h-5 w-5 text-text-tertiary hover:text-brand-default transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      done
                        ? "text-text-tertiary line-through"
                        : "text-text-primary hover:text-brand-default"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {!done && (
                    <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                  )}
                </div>
                {!done && <Icon className="h-4 w-4 text-text-tertiary shrink-0 mt-0.5" />}
              </div>
            )
          })}
        </CardContent>
      )}
    </Card>
  )
}
