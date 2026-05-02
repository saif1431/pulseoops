import Link from "next/link"
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Rocket, Users } from "lucide-react"

const perks = [
  { icon: Rocket, title: "Ship Fast", description: "Deploy daily. Small teams, big impact, real ownership." },
  { icon: Heart, title: "Remote First", description: "Work from anywhere. Async-friendly, timezone-flexible." },
  { icon: Users, title: "Great People", description: "Talented, kind engineers who love building reliable systems." },
]

const openings = [
  {
    title: "Senior Backend Engineer",
    team: "Platform",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Build the core monitoring engine, check scheduler, and alerting pipeline.",
  },
  {
    title: "Frontend Engineer",
    team: "Product",
    location: "Remote (Worldwide)",
    type: "Full-time",
    description: "Craft beautiful dashboard experiences with Next.js, React, and Tailwind.",
  },
  {
    title: "Site Reliability Engineer",
    team: "Infrastructure",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Keep PulseOps itself running at 99.99%. Operate our global check infrastructure.",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote (Worldwide)",
    type: "Full-time",
    description: "Design intuitive workflows for incident management and status communication.",
  },
]

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-default/20 bg-brand-default/5 px-4 py-1.5 text-sm font-medium text-brand-default mb-6">
          <Briefcase className="h-4 w-4" />
          Careers at PulseOps
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-text-primary">
          Build the future of reliability
        </h1>
        <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          We&apos;re a small, fast-moving team building the monitoring platform we always wished existed. If you care about uptime, great UX, and shipping with purpose — we&apos;d love to hear from you.
        </p>
      </section>

      {/* Perks */}
      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {perks.map((perk) => {
          const Icon = perk.icon
          return (
            <div
              key={perk.title}
              className="rounded-xl border border-line-default bg-bg-surface p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-default/10">
                <Icon className="h-6 w-6 text-brand-default" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">{perk.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{perk.description}</p>
            </div>
          )
        })}
      </section>

      {/* Open positions */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-text-primary text-center">Open Positions</h2>
        <p className="mt-3 text-text-secondary text-center">
          Don&apos;t see a role that fits? Email us at{" "}
          <a href="mailto:careers@pulseops.io" className="text-brand-default hover:text-brand-hover font-medium">
            careers@pulseops.io
          </a>
        </p>

        <div className="mt-10 space-y-4">
          {openings.map((job) => (
            <Link
              key={job.title}
              href="/contact"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-line-default bg-bg-surface p-6 transition-all hover:border-brand-default/30 hover:shadow-sm"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-default transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-text-secondary">{job.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.team}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.type}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-default group-hover:translate-x-1 transition-transform">
                  Apply <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-24 rounded-2xl border border-line-default bg-gradient-to-br from-brand-default/5 to-transparent p-12 text-center">
        <h2 className="text-2xl font-bold text-text-primary">Life at PulseOps</h2>
        <p className="mt-3 text-text-secondary max-w-lg mx-auto">
          Competitive salary, equity, flexible PTO, home office stipend, and the chance to work on software that keeps the internet running.
        </p>
        <a
          href="mailto:careers@pulseops.io"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-brand-default px-6 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
        >
          Get in touch
        </a>
      </section>
    </div>
  )
}
