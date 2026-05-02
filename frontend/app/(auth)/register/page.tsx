"use client"

import * as React from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions/billing"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const PRICE_IDS = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "price_pro",
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS ?? "price_business",
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [emailError, setEmailError] = React.useState<string | null>(null)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)

  const calculateStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1
    return strength
  }

  const strength = calculateStrength(password)

  const requestedPlan =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("plan") : null

  const validatePassword = (value: string): string | null => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[0-9]/.test(value)) {
      return "Password must include at least one number"
    }
    return null
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setEmailError(null)
    setFormError(null)

    const validationError = validatePassword(password)
    if (validationError) {
      setPasswordError(validationError)
      return
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    setPasswordError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        let message = "Unable to create your account"
        try {
          const data = await response.json()
          message = data?.detail ?? data?.message ?? message
        } catch {
          // Ignore malformed JSON responses.
        }

        if (response.status === 409 || /already exists|already registered/i.test(message)) {
          setEmailError("Email is already in use")
        } else {
          setFormError(message)
        }

        setIsLoading(false)
        return
      }

      const plan = requestedPlan

      if (plan === "pro" || plan === "business") {
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (loginResult?.error) {
          setFormError("Account created, but automatic login failed. Please sign in.")
          setIsLoading(false)
          return
        }

        await createCheckoutSession(PRICE_IDS[plan])
        return
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
      })
    } catch {
      setFormError("Unable to create your account. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-text-primary">Create an account</h1>
        <p className="text-sm text-text-secondary mt-2">
          Start monitoring your infrastructure for free.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {formError && (
          <div className="rounded-md bg-status-down/10 p-3 border border-status-down/20">
            <p className="text-sm text-status-down font-medium">{formError}</p>
          </div>
        )}

        <Input 
          id="name"
          type="text" 
          label="Full name" 
          placeholder="Jane Doe" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required 
        />
        
        <Input 
          id="email"
          type="email" 
          label="Email address" 
          placeholder="name@example.com" 
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError(null)
          }}
          errorMessage={emailError ?? undefined}
          disabled={isLoading}
          required 
        />
        
        <div className="space-y-2">
          <Input 
            id="password"
            type="password" 
            label="Password"
            placeholder="••••••••" 
            required 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError(validatePassword(e.target.value))
            }}
            errorMessage={passwordError ?? undefined}
            disabled={isLoading}
          />
          {password.length > 0 && (
            <div className="flex gap-1 h-1.5 mt-2">
              {[1, 2, 3, 4].map((level) => (
                <div 
                  key={level} 
                  className={cn(
                    "h-full flex-1 rounded-full transition-colors duration-300",
                    strength >= level 
                      ? strength < 2 ? "bg-status-down" : strength < 4 ? "bg-status-degraded" : "bg-status-up"
                      : "bg-bg-subtle"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <Input 
          id="confirm-password"
          type="password" 
          label="Confirm password"
          placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          required 
        />

        <div className="flex items-start gap-2 pt-2">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1 h-4 w-4 rounded border-line-default bg-bg-surface text-brand-default focus:ring-brand-focus focus:ring-offset-bg-base"
            required
          />
          <label htmlFor="terms" className="text-sm text-text-secondary leading-tight">
            I agree to the <Link href="/terms" className="text-brand-default hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-brand-default hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <Button type="submit" variant="primary" className="w-full mt-6" loading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="mt-10 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold leading-6 text-brand-default hover:text-brand-hover">
          Sign in
        </Link>
      </p>
    </div>
  )
}
