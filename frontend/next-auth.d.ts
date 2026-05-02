import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken: string
    user: {
      id: string
      plan: string
      email: string
      name: string
    }
  }

  interface User {
    id: string
    plan: string
    accessToken: string
    email: string
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    userId: string
    plan: string
  }
}
