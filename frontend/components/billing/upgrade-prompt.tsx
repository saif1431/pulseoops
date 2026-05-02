import Link from "next/link"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UpgradePromptProps {
  feature: string
  requiredPlan: "PRO" | "BUSINESS"
}

export function UpgradePrompt({ feature, requiredPlan }: UpgradePromptProps) {
  return (
    <div className="rounded-lg border border-dashed border-line-default bg-bg-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-brand-subtle p-2">
            <Lock className="h-4 w-4 text-brand-default" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">{feature}</p>
              <Badge className="bg-brand-default/10 text-brand-default border-none text-[10px] py-0">
                {requiredPlan}
              </Badge>
            </div>
            <p className="text-sm text-text-secondary">This feature requires {requiredPlan}.</p>
          </div>
        </div>
        <Link href="/pricing" className="shrink-0">
          <Button type="button" variant="outline">
            Upgrade now
          </Button>
        </Link>
      </div>
    </div>
  )
}
