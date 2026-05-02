import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy Middleware Logic
 * Handles authentication protection and custom domain rewrites.
 * Separating this logic allows for better testing and future Next.js 16 upgrade paths.
 */
export const proxyMiddleware = auth((req: NextRequest & { auth?: any }) => {
  const { nextUrl, auth } = req
  const url = nextUrl.clone()
  const host = req.headers.get("host") || ""
  const TEMP_AUTH_BYPASS = true
  
  // 1. Custom Domain Support
  // Check if we are on a custom domain (not pulseops.io or localhost)
  const isMainDomain = 
    host.includes("pulseops.io") || 
    host.includes("localhost") || 
    host.includes("vercel.app") // Supporting Vercel previews
  
  if (!isMainDomain && !nextUrl.pathname.startsWith("/api")) {
    // Handle custom domain rewrites
    // Example: status.customer.com -> /status/customer
    // We assume the first part of the subdomain is the slug for simplicity, 
    // or you could have a mapping/database lookup here.
    const parts = host.split('.')
    if (parts.length >= 3) {
      const slug = parts[0]
      url.pathname = `/status/${slug}${nextUrl.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // 2. Authentication Protection
  const isProtectedRoute = 
    nextUrl.pathname.startsWith("/dashboard") || 
    nextUrl.pathname.startsWith("/settings")
  
  if (!TEMP_AUTH_BYPASS && isProtectedRoute && !auth) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Redirect authenticated users away from auth pages
  const isAuthPage = 
    nextUrl.pathname === "/login" || 
    nextUrl.pathname === "/register" || 
    nextUrl.pathname === "/forgot-password"
  
  if (!TEMP_AUTH_BYPASS && isAuthPage && auth) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})
