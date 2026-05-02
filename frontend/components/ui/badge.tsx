import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { StatusDot } from "./status-dot"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-focus focus:ring-offset-2",
  {
    variants: {
      variant: {
        success: "border-transparent bg-status-up/10 text-status-up hover:bg-status-up/20",
        warning: "border-transparent bg-status-degraded/10 text-status-degraded hover:bg-status-degraded/20",
        danger: "border-transparent bg-status-down/10 text-status-down hover:bg-status-down/20",
        neutral: "border-transparent bg-status-pending/10 text-status-pending hover:bg-status-pending/20",
        brand: "border-transparent bg-brand-default/10 text-brand-default hover:bg-brand-default/20",
      },
      size: {
        sm: "text-[10px] leading-3",
        md: "text-xs leading-4",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "up" | "down" | "degraded" | "pending"
  size?: "sm" | "md"
}

function StatusBadge({ status, size = "md", className, children, ...props }: StatusBadgeProps) {
  const variantMap: Record<string, BadgeProps["variant"]> = {
    up: "success",
    down: "danger",
    degraded: "warning",
    pending: "neutral",
  }

  return (
    <Badge variant={variantMap[status]} size={size} className={cn("gap-1.5", className)} {...props}>
      <StatusDot status={status} size="sm" />
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export { Badge, StatusBadge, badgeVariants }
