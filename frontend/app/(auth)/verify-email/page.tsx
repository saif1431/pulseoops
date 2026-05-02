"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = React.useState<"pending" | "verifying" | "success" | "error">(
    token ? "verifying" : "pending"
  )
  const [error, setError] = React.useState<string | null>(null)
  const [resending, setResending] = React.useState(false)
  const [resent, setResent] = React.useState(false)

  // Auto-verify if token is present
  React.useEffect(() => {
    if (!token) return

    const verify = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.detail || "Verification failed")
        }

        setStatus("success")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed. The link may have expired.")
        setStatus("error")
      }
    }

    verify()
  }, [token])

  const handleResend = async () => {
    setResending(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      setResent(true)
    } catch {
      // silently fail — we don't reveal if the email exists
    } finally {
      setResending(false)
    }
  }

  // Pending state — user just registered
  if (status === "pending") {
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-default/10">
          <Mail className="h-8 w-8 text-brand-default" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Check your email</h1>
          <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
            We&apos;ve sent a verification link to your email address. Click the link to activate your account.
          </p>
        </div>

        <div className="rounded-lg border border-line-default bg-bg-surface p-4 text-left space-y-3">
          <p className="text-sm text-text-primary font-medium">Didn&apos;t get the email?</p>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email</li>
            <li>• Wait a few minutes and try again</li>
          </ul>
        </div>

        <div className="space-y-3">
          {resent ? (
            <p className="text-sm text-status-up font-medium">Verification email resent!</p>
          ) : (
            <Button type="button" variant="outline" onClick={handleResend} loading={resending}>
              Resend verification email
            </Button>
          )}
          <p className="text-sm text-text-secondary">
            <Link href="/login" className="text-brand-default hover:text-brand-hover font-medium">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // Verifying state — loading
  if (status === "verifying") {
    return (
      <div className="w-full text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-default mx-auto" />
        <h1 className="text-xl font-bold text-text-primary">Verifying your email...</h1>
        <p className="text-sm text-text-secondary">Please wait while we confirm your email address.</p>
      </div>
    )
  }

  // Success state
  if (status === "success") {
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-up/10">
          <CheckCircle2 className="h-8 w-8 text-status-up" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Email verified!</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Your email has been confirmed. You can now sign in to your account.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex h-10 items-center rounded-md bg-brand-default px-6 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
        >
          Sign in to PulseOps
        </Link>
      </div>
    )
  }

  // Error state
  return (
    <div className="w-full text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-down/10">
        <AlertCircle className="h-8 w-8 text-status-down" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Verification failed</h1>
        <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
          {error || "This verification link is invalid or has expired."}
        </p>
      </div>
      <div className="space-y-3">
        {resent ? (
          <p className="text-sm text-status-up font-medium">New verification email sent!</p>
        ) : (
          <Button type="button" variant="outline" onClick={handleResend} loading={resending}>
            Resend verification email
          </Button>
        )}
        <p className="text-sm text-text-secondary">
          <Link href="/login" className="text-brand-default hover:text-brand-hover font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
