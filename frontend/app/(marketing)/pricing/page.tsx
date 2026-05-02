"use client"

import { PricingTable } from "@/components/pricing/pricing-table"
import { motion } from "framer-motion"

import { premiumFadeIn } from "@/lib/animations"

export default function PricingPage() {
  return (
    <div className="bg-bg-base min-h-screen">
      {/* Header Section */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-dot-pattern border-b border-line-default">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...premiumFadeIn}>
            <div className="inline-flex items-center rounded-full border border-line-default bg-white px-4 py-1.5 text-sm font-bold text-brand-primary shadow-premium mb-8">
              💎 Transparent Pricing
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-text-primary mb-8 leading-[0.95]">
              Monitoring that <br /> <span className="text-gradient">scales with your team</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl font-medium text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Simple, predictable pricing for teams of all sizes. No credit card required to get started with our free tier.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05)_0,transparent_70%)] -z-10" />
      </section>

      {/* Pricing Table Section */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PricingTable />
        </div>
      </section>
      
      {/* FAQ Link / Help CTA */}
      <section className="pb-32 px-6">
        <div className="mx-auto max-w-4xl bg-bg-elevated rounded-[48px] p-12 text-center border border-line-default shadow-premium">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Need a custom plan?</h2>
          <p className="text-lg text-text-secondary mb-8 font-medium">We offer tailored solutions for enterprises with massive scale. Let's talk about your requirements.</p>
          <div className="flex justify-center">
            <button className="btn-secondary h-14 px-10 text-lg">Contact Enterprise Sales</button>
          </div>
        </div>
      </section>
    </div>
  )
}
