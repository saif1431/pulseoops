import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusDotVariants = cva(
  "rounded-full relative flex",
  {
    variants: {
      status: {
        up: "bg-status-up",
        down: "bg-status-down",
        degraded: "bg-status-degraded",
        pending: "bg-status-pending",
      },
      size: {
        sm: "h-2 w-2",
        md: "h-3 w-3",
        lg: "h-4 w-4",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "md",
    },
  }
)

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusDotVariants> {}

function StatusDot({ status, size, className, ...props }: StatusDotProps) {
  return (
    <span className={cn(statusDotVariants({ status, size }), className)} {...props}>
      {status === "up" && (
        <span className="animate-pulse-slow absolute inline-flex h-full w-full rounded-full bg-status-up opacity-75"></span>
      )}
      {status === "down" && (
        <span className="animate-pulse-fast absolute inline-flex h-full w-full rounded-full bg-status-down opacity-75"></span>
      )}
      {status === "degraded" && (
        <span className="animate-pulse-medium absolute inline-flex h-full w-full rounded-full bg-status-degraded opacity-75"></span>
      )}
    </span>
  )
}

export { StatusDot, statusDotVariants }
