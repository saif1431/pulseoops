"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export function MarketingHeader() {
  const { status } = useSession()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex h-20 w-full items-center justify-between px-6 transition-all duration-500 lg:px-16",
        scrolled 
          ? "border-b border-line-default/60 bg-white/80 backdrop-blur-xl shadow-sm" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="flex items-center gap-2 flex-1">
        <Link href="/" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus rounded-sm group">
          <Image src="/logo-transparent.png" alt="PulseOps Logo" width={280} height={76} className="h-16 w-auto" priority />
        </Link>
      </div>

      <nav className="hidden md:flex items-center justify-center gap-10 text-sm font-medium flex-1">
        <Link href="/#features" className="text-text-secondary hover:text-brand-primary transition-all duration-300 relative group">
          Features
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="/pricing" className="text-text-secondary hover:text-brand-primary transition-all duration-300 relative group">
          Pricing
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="/docs" className="text-text-secondary hover:text-brand-primary transition-all duration-300 relative group">
          Docs
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="/blog" className="text-text-secondary hover:text-brand-primary transition-all duration-300 relative group">
          Blog
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
        </Link>
      </nav>

      <div className="hidden md:flex items-center justify-end gap-6 flex-1">
        {status === "authenticated" ? (
          <Link href="/dashboard">
            <Button className="btn-primary h-10 px-6 text-sm">Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-text-primary hover:text-brand-primary transition-colors">
              Login
            </Link>
            <Link href="/register">
              <Button className="btn-primary h-10 px-6 text-sm">Get Started</Button>
            </Link>
          </>
        )}
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-text-secondary">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full">
            <SheetTitle>PulseOps</SheetTitle>
            <div className="flex flex-col gap-6 mt-12">
              <Link href="/#features" className="text-lg font-semibold">Features</Link>
              <Link href="/pricing" className="text-lg font-semibold">Pricing</Link>
              <Link href="/docs" className="text-lg font-semibold">Docs</Link>
              <Link href="/blog" className="text-lg font-semibold">Blog</Link>
              <hr />
              {status === "authenticated" ? (
                <Link href="/dashboard">
                  <Button className="btn-primary h-12 w-full text-base">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-base font-medium">Login</Link>
                  <Link href="/register">
                    <Button className="btn-primary h-12 w-full text-base">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
