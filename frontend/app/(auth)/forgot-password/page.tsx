"use client"

import * as React from "react"
import Link from "next/link"
import { Mail, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok && res.status === 429) {
        setError("Too many requests. Please wait a few minutes before trying again.")
        return
      }

      // Always show success to avoid email enumeration
      setSubmitted(true)
    } catch {
      // Still show success to avoid leaking whether the email exists
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-text-primary">Reset your password</h1>
        <p className="text-sm text-text-secondary mt-2">
          Enter your email and we&apos;ll send reset instructions.
        </p>
      </div>

      {submitted ? (
        <div className="space-y-4 rounded-md border border-line-default bg-bg-surface p-4">
          <p className="text-sm text-text-primary">If an account exists for {email}, a reset link has been sent.</p>
          <p className="text-sm text-text-secondary">
            Check your spam folder if you don&apos;t see it within a few minutes.
          </p>
          <Link href="/login" className="text-sm font-medium text-brand-default hover:text-brand-hover">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-md bg-status-down/10 p-4 border border-status-down/20 flex gap-3">
              <AlertCircle className="h-5 w-5 text-status-down shrink-0" />
              <p className="text-sm text-status-down font-medium">{error}</p>
            </div>
          )}
          <Input
            id="email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            required
            disabled={loading}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
          <p className="text-center text-sm text-text-secondary">
            Remembered your password?{" "}
            <Link href="/login" className="text-brand-default hover:text-brand-hover font-medium">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
