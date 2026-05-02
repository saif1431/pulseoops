import * as React from "react"
import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white text-text-primary">
      {/* Left panel (40%) - Hidden on mobile */}
      <div className="hidden lg:flex w-[40%] shrink-0 flex-col justify-between bg-bg-base border-r border-line-default p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(216,180,254,0.1)_0,transparent_50%)]" />
        
        <Link href="/" className="relative z-10 flex w-fit items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus">
          <Image src="/logo-transparent.png" alt="PulseOps Logo" width={300} height={84} className="h-20 w-auto" priority />
        </Link>
        
        <div className="space-y-6 relative z-10">
          <h2 className="text-5xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
            Reliability <br />starts here.
          </h2>
          <p className="text-lg text-text-secondary max-w-md font-medium leading-relaxed">
            The modern platform for monitoring your infrastructure, managing incidents, and communicating status to your customers.
          </p>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center space-x-[-12px]">
            {/* Mock avatars for social proof */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-12 rounded-2xl border-4 border-bg-base bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0" style={{ zIndex: 10 - i }}>
                <span className="text-xs text-brand-default font-bold">U{i}</span>
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-text-primary tracking-tight">
            &quot;Used by 500+ engineering teams.&quot;
          </p>
        </div>
      </div>
      
      {/* Right panel (60%) */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden flex justify-center">
            <Link href="/" className="flex w-fit items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus">
              <Image src="/logo-transparent.png" alt="PulseOps Logo" width={260} height={72} className="h-14 w-auto" priority />
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}
