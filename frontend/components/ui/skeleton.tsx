import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-bg-subtle",
  {
    variants: {
      variant: {
        text: "h-4 w-full",
        card: "h-32 w-full rounded-xl",
        "table-row": "h-12 w-full",
        avatar: "h-10 w-10 rounded-full",
        "stat-card": "h-24 w-full rounded-lg",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
