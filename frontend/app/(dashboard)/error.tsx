"use client"

import * as React from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-down/10 mb-6">
        <AlertTriangle className="h-10 w-10 text-status-down" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-2">Something went wrong!</h2>
      <p className="text-text-secondary max-w-md mb-8">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
        <Button onClick={() => reset()} variant="primary" leftIcon={<RefreshCcw className="h-4 w-4" />}>
          Try again
        </Button>
      </div>
    </div>
  )
}
