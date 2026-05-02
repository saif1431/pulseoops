"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  if (!token) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-md bg-status-down/10 p-4 border border-status-down/20 flex gap-3">
          <AlertCircle className="h-5 w-5 text-status-down shrink-0" />
          <div>
            <p className="text-sm font-medium text-status-down">Invalid reset link</p>
            <p className="mt-1 text-sm text-text-secondary">
              This password reset link is invalid or has expired.
            </p>
          </div>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex text-sm font-medium text-brand-default hover:text-brand-hover"
        >
          Request a new reset link
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-md bg-status-up/10 p-4 border border-status-up/20 flex gap-3">
          <CheckCircle2 className="h-5 w-5 text-status-up shrink-0" />
          <div>
            <p className="text-sm font-medium text-status-up">Password reset successfully</p>
            <p className="mt-1 text-sm text-text-secondary">
              Your password has been updated. You can now sign in with your new password.
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="inline-flex h-9 items-center rounded-md bg-brand-default px-4 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
        >
          Sign in
        </Link>
      </div>
    )
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || "Unable to reset password. The link may have expired.")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-text-primary">Set new password</h1>
        <p className="text-sm text-text-secondary mt-2">
          Enter your new password below. Must be at least 8 characters.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-status-down/10 p-4 border border-status-down/20 flex gap-3">
          <AlertCircle className="h-5 w-5 text-status-down shrink-0" />
          <p className="text-sm text-status-down font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="password"
          type="password"
          label="New password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          required
          disabled={loading}
        />
        <Input
          id="confirm-password"
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          required
          disabled={loading}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Reset password
        </Button>
        <p className="text-center text-sm text-text-secondary">
          Remembered your password?{" "}
          <Link href="/login" className="text-brand-default hover:text-brand-hover font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
