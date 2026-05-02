import * as React from "react"
import { auth } from "@/lib/auth"
import { ProfileClient } from "@/components/settings/profile-client"

const API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type ApiUser = {
  name: string
  email: string
}

async function fetchProfile(accessToken?: string | null): Promise<ApiUser | null> {
  if (!accessToken) return null
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProfilePage() {
  const session = await auth()
  const profile = await fetchProfile(session?.accessToken)

  const user = {
    name: profile?.name || session?.user?.name || "User",
    email: profile?.email || session?.user?.email || "",
    image: session?.user?.image || undefined,
  }

  return <ProfileClient user={user} />
}
