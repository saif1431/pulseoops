import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

const API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const providers: Provider[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(credentials) {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      if (!res.ok) return null
      const data = await res.json()
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        plan: data.user.plan,
        accessToken: data.access_token,
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = (user as any).accessToken
        token.userId = user.id
        token.plan = (user as any).plan
      }

      if (account?.provider && account.provider !== "credentials") {
        const oauthToken = account.id_token || account.access_token
        if (oauthToken) {
          const res = await fetch(`${API_URL}/api/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: account.provider,
              token: oauthToken,
              token_type: account.id_token ? "id_token" : "access_token",
            }),
          })

          if (res.ok) {
            const data = await res.json()
            token.accessToken = data.access_token
            token.userId = data.user.id
            token.plan = data.user.plan
          }
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken as string
        session.user.id = token.userId as string
        session.user.plan = token.plan as string
      }
      return session
    }
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" }
})