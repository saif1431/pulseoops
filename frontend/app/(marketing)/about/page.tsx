import { Activity, Shield, Zap, Globe, Users, HeartHandshake } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Reliability First",
    description:
      "We obsess over uptime — both ours and yours. Every decision we make is filtered through the lens of reliability.",
  },
  {
    icon: Zap,
    title: "Speed Matters",
    description:
      "From sub-second monitor checks to instant incident alerts, we believe fast feedback loops save businesses.",
  },
  {
    icon: Globe,
    title: "Transparency by Default",
    description:
      "Public status pages, open incident timelines, and honest communication — transparency builds trust.",
  },
  {
    icon: Users,
    title: "Team-Centric",
    description:
      "Built for modern SRE and DevOps teams. Multi-user workspaces, role-based access, and shared context.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Obsessed",
    description:
      "Your customers deserve to know what's happening. We make it easy to keep them in the loop.",
  },
  {
    icon: Activity,
    title: "Data Driven",
    description:
      "Uptime percentages, latency trends, and incident analytics give you the insights to improve continuously.",
  },
]

const timeline = [
  { year: "2024", event: "PulseOps founded with a mission to democratize reliability tooling." },
  { year: "2024", event: "Launched URL monitoring, incident management, and public status pages." },
  { year: "2025", event: "Introduced Pro and Business plans with Stripe-powered billing." },
  { year: "2025", event: "Added multi-channel alerting: email, Slack, and webhook integrations." },
  { year: "2026", event: "Reached 500+ engineering teams. Custom domains and API v2 released." },
]

const stats = [
  { label: "Engineering Teams", value: "500+" },
  { label: "Monitors Running", value: "12K+" },
  { label: "Uptime Checks / Day", value: "8M+" },
  { label: "Avg Response Time", value: "<200ms" },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-default/20 bg-brand-default/5 px-4 py-1.5 text-sm font-medium text-brand-default mb-6">
          <Activity className="h-4 w-4" />
          About PulseOps
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-text-primary">
          Reliability infrastructure for modern teams
        </h1>
        <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          PulseOps helps engineering teams monitor uptime, manage incidents, and communicate status to their customers — all from a single, beautiful platform.
        </p>
      </section>

      {/* Stats */}
      <section className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line-default bg-bg-surface p-6 text-center"
          >
            <p className="text-3xl font-bold text-brand-default">{stat.value}</p>
            <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Our Story */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-text-primary text-center">Our Story</h2>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-center leading-relaxed">
          We started PulseOps because we believed that every team — not just those at big tech companies — deserves world-class reliability tooling. Too many incident management tools are bloated, expensive, and hard to set up. We built PulseOps to be the opposite: fast to deploy, intuitive to use, and priced for teams of all sizes.
        </p>
      </section>

      {/* Timeline */}
      <section className="mt-16 max-w-2xl mx-auto">
        <div className="relative border-l-2 border-line-default pl-8 space-y-8">
          {timeline.map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-brand-default bg-bg-base" />
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-default">
                {item.year}
              </p>
              <p className="mt-1 text-text-secondary">{item.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-text-primary text-center">What We Believe</h2>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-center">
          Our values shape everything we build.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div
                key={value.title}
                className="rounded-xl border border-line-default bg-bg-surface p-6 transition-colors hover:border-brand-default/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-default/10">
                  <Icon className="h-5 w-5 text-brand-default" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">{value.title}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 rounded-2xl border border-line-default bg-gradient-to-br from-brand-default/5 to-transparent p-12 text-center">
        <h2 className="text-3xl font-bold text-text-primary">Ready to get started?</h2>
        <p className="mt-3 text-text-secondary max-w-lg mx-auto">
          Join 500+ teams who trust PulseOps for their uptime monitoring and incident management.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="/register"
            className="inline-flex h-10 items-center rounded-md bg-brand-default px-6 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
          >
            Start free
          </a>
          <a
            href="/contact"
            className="inline-flex h-10 items-center rounded-md border border-line-default px-6 text-sm font-medium text-text-primary hover:bg-bg-subtle transition-colors"
          >
            Talk to us
          </a>
        </div>
      </section>
    </div>
  )
}
