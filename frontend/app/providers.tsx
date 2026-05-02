"use client"

import * as React from "react"
import { SessionProvider } from "next-auth/react"

import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner"
import { Toaster } from "@/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CookieConsentBanner />
      <Toaster />
    </SessionProvider>
  )
}
