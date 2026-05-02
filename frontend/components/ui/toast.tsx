"use client"

import { Toaster as Sonner } from "sonner"
import * as React from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-bg-elevated group-[.toaster]:text-text-primary group-[.toaster]:border-line-default group-[.toaster]:shadow-lg font-sans",
          description: "group-[.toast]:text-text-secondary",
          actionButton:
            "group-[.toast]:bg-brand-default group-[.toast]:text-text-primary",
          cancelButton:
            "group-[.toast]:bg-bg-subtle group-[.toast]:text-text-primary",
          success: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-status-up group-[.toaster]:text-text-primary",
          error: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-status-down group-[.toaster]:text-text-primary",
          warning: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-status-degraded group-[.toaster]:text-text-primary",
          info: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-brand-default group-[.toaster]:text-text-primary",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
