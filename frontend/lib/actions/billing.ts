"use server"

import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { apiPost } from "@/lib/api-client"

export async function createCheckoutSession(priceId: string) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const data = await apiPost<{ url: string }>("/api/billing/checkout", {
    price_id: priceId,
  })

  redirect(data.url)
}

export async function createPortalSession() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const data = await apiPost<{ url: string }>("/api/billing/portal", {})

  redirect(data.url)
}
