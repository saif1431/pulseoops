"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Activity, Globe, Zap, Shield, Map, AlertTriangle, ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PricingTable } from "@/components/pricing/pricing-table"
import { Card } from "@/components/ui/card"
import { premiumFadeIn, staggerContainer, staggerItem } from "@/lib/animations"

export default function LandingPage() {
  const features = [
    { name: "Instant alerts", description: "Get notified immediately when a monitor goes down via email, SMS, or Slack.", icon: Zap },
    { name: "Public status pages", description: "Keep your customers informed with beautiful, customizable status pages.", icon: Globe },
    { name: "Response tracking", description: "Monitor latency and identify performance bottlenecks before they affect users.", icon: Activity },
    { name: "SSL monitoring", description: "Never let a certificate expire with automated warnings days in advance.", icon: Shield },
    { name: "Multi-region checks", description: "Verify your site is accessible from multiple geographic locations globally.", icon: Map },
    { name: "Incident tracking", description: "Collaborate on outages with built-in incident tracking and post-mortems.", icon: AlertTriangle },
  ]

  const stats = [
    { label: "Uptime guarantee", value: "99.9%" },
    { label: "Faster response", value: "40%" },
    { label: "Regions covered", value: "12+" },
    { label: "Active monitors", value: "10k+" },
  ]

  const steps = [
    { step: "01", title: "Add monitors", desc: "Configure HTTP, API, or ping endpoints with guided setup." },
    { step: "02", title: "Connect alerts", desc: "Route alerts to Slack, Discord, PagerDuty, email, and webhooks." },
    { step: "03", title: "Share status", desc: "Keep customers informed with incident timelines and status pages." },
  ]

  const faqs = [
    { question: "What services do you offer?", answer: "PulseOps provides uptime checks, SSL monitoring, response tracking, incident workflows, and public status pages." },
    { question: "Who is PulseOps best suited for?", answer: "PulseOps is ideal for startups, engineering teams, and digital product companies that need reliable monitoring." },
    { question: "Do you offer custom solutions?", answer: "Yes. Business plans include custom intervals, white-label status pages, and priority support." },
    { question: "How quickly can we get started?", answer: "Most teams complete setup in under 5 minutes and can start receiving alerts immediately." },
  ]

  const integrations = [
    { name: "Slack", icon: "💬" },
    { name: "Discord", icon: "🎮" },
    { name: "PagerDuty", icon: "🚨" },
    { name: "Opsgenie", icon: "⚙️" },
    { name: "Webhook", icon: "🔗" },
    { name: "Email", icon: "📧" },
  ]

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <div className="bg-bg-base font-sans selection:bg-brand-primary selection:text-white">
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center rounded-full border border-line-default bg-white px-4 py-2 text-xs font-medium text-text-secondary shadow-sm"
            >
              <span className="mr-2 text-base">🚀</span>
              PulseOps v2.0 is now available
              <ArrowRight className="ml-2 h-4 w-4 text-brand-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              Simplify monitoring.
              <span className="block text-gradient">Scale reliability faster.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg"
            >
              PulseOps gives engineering teams one place to monitor uptime, manage incidents, and share clear status updates with customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/register">
                <Button size="lg" className="btn-primary h-12 px-7 text-base">Get Started Free</Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="btn-secondary h-12 px-7 text-base gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mx-auto mt-14 max-w-6xl rounded-3xl border border-line-default bg-white p-2 shadow-premium"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-bg-elevated">
              <Image
                src="https://cdn.dribbble.com/userupload/16548002/file/original-81cb1d02cdf0afdf38ddd6cd91beff57.png?resize=752x&vertical=center"
                alt="PulseOps Dashboard"
                fill
                sizes=""
                className="object-contain object-top"
                priority
              />
            </div>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(88,80,236,0.12)_0,transparent_70%)]" />
      </section>

      <section className="border-y border-line-default bg-bg-elevated/40 py-14">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.24em] text-text-tertiary">
            Trusted by teams at the world&apos;s most innovative companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {Array.from({ length: 6}).map((_, idx) => (
              <Image
                key={idx}
                src="/logo-transparent.png"
                alt="PulseOps"
                width={200}
                height={50}
                className="h-16  w-auto opacity-70 grayscale-0 transition duration-300 hover:opacity-100"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Unlock premium benefits with advanced features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              A cleaner workflow for operations teams - from detection to resolution and reporting.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {features.slice(0, 4).map((feature, idx) => (
              <motion.div key={feature.name} variants={staggerItem}>
                <Card className="h-full rounded-2xl border border-line-default bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-premium">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-subtle text-brand-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-text-tertiary">0{idx + 1}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-text-primary">{feature.name}</h3>
                  <p className="text-sm leading-6 text-text-secondary sm:text-base">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeUp} className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {features.slice(4).map((feature) => (
              <Card key={feature.name} className="rounded-2xl border border-line-default bg-bg-elevated p-6 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle text-brand-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h4 className="mb-1.5 text-lg font-semibold text-text-primary">{feature.name}</h4>
                <p className="text-sm leading-6 text-text-secondary">{feature.description}</p>
              </Card>
            ))}
            <Card className="rounded-2xl border border-brand-primary/30 bg-brand-subtle/40 p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-brand-primary">PulseOps Advantage</p>
              <ul className="space-y-2">
                {["Fast setup in under 5 minutes", "Automated alerts across channels", "Professional public status pages"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-primary">
                    <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="bg-bg-elevated py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Why teams choose PulseOps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
              Clear metrics. Better coordination. Higher reliability.
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem} className="rounded-2xl border border-line-default bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
                Connect your existing
                <br />
                stack in minutes
              </h2>
              <p className="mb-8 mt-4 text-base leading-7 text-text-secondary sm:text-lg">
                PulseOps integrates with all the tools your team already loves. From Slack to PagerDuty, we keep everyone in the loop.
              </p>
              <div className="flex flex-wrap gap-3">
                {integrations.map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 rounded-full border border-line-default bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary shadow-sm"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-3 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="flex aspect-square items-center justify-center rounded-2xl border border-line-default bg-white text-3xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium">
                    {i === 1 ? "💬" : i === 2 ? "🎮" : i === 3 ? "🚨" : i === 4 ? "⚙️" : i === 5 ? "🔗" : i === 6 ? "📧" : "⚡"}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-line-default bg-bg-elevated py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Get started in 3 easy steps
              </h2>
              <p className="mb-8 mt-4 max-w-lg text-base leading-7 text-text-secondary sm:text-lg">
                A guided flow designed for speed and clarity from setup to team rollout.
              </p>
              <Link href="/register">
                <Button size="lg" className="btn-primary h-12 px-7 text-base">Start Building Today</Button>
              </Link>
            </motion.div>

            <div className="space-y-5">
              {steps.map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.14, duration: 0.65 }}
                  className="group flex gap-5 rounded-2xl border border-line-default bg-white p-6 shadow-sm transition-all hover:border-brand-primary/40 hover:shadow-premium"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-base font-semibold text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-sm leading-6 text-text-secondary sm:text-base">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div {...premiumFadeIn} className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-base text-text-secondary sm:text-lg">Everything you need to know before launching with PulseOps.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group rounded-2xl border border-line-default bg-bg-surface transition-all duration-300 hover:border-brand-primary/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-semibold text-text-primary sm:text-lg">
                  {faq.question}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-line-default transition-all group-open:bg-brand-primary group-open:text-white">
                    <ArrowRight className="h-4 w-4 rotate-90 transition-transform group-open:-rotate-90" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-sm leading-6 text-text-secondary sm:text-base">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative overflow-hidden bg-bg-elevated py-20 sm:py-24">
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div {...premiumFadeIn} className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Flexible plans for
              <span className="text-gradient"> scaling infrastructure</span>
            </h2>
            <p className="mt-4 text-base text-text-secondary sm:text-lg">Simple pricing that grows with your team. No hidden fees.</p>
          </motion.div>
          <PricingTable />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl bg-brand-primary px-6 py-16 text-center shadow-[0_28px_60px_-24px_rgba(88,80,236,0.6)] sm:px-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.2)_0,transparent_50%)]" />
            <div className="relative z-10">
              <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white/95 px-5 py-3 shadow-lg ring-1 ring-white/40">
                <Image src="/logo.png" alt="PulseOps" width={210} height={56} className="h-10 w-auto" />
              </div>
              <h2 className="mx-auto mb-5 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                Ready to monitor like a high-performing team?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-base text-white/85 sm:text-lg">
                Join teams that rely on PulseOps for real-time visibility, faster incident response, and transparent customer communication.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="h-12 rounded-full bg-white px-8 text-base font-semibold text-brand-primary transition-all hover:bg-bg-elevated">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-white/30 px-8 text-base font-semibold text-white hover:bg-white/10">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
