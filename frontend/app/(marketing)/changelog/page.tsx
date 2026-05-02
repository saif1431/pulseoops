import { Tag, Sparkles, Wrench, ShieldCheck } from "lucide-react"

type ChangeType = "feature" | "improvement" | "fix" | "security"

interface ChangelogEntry {
  version: string
  date: string
  title: string
  changes: Array<{ type: ChangeType; text: string }>
}

const typeConfig: Record<ChangeType, { icon: typeof Tag; label: string; color: string }> = {
  feature: { icon: Sparkles, label: "New", color: "text-brand-default bg-brand-default/10" },
  improvement: { icon: Wrench, label: "Improved", color: "text-accent-cyan bg-accent-cyan/10" },
  fix: { icon: Tag, label: "Fixed", color: "text-status-degraded bg-status-degraded/10" },
  security: { icon: ShieldCheck, label: "Security", color: "text-status-up bg-status-up/10" },
}

const changelog: ChangelogEntry[] = [
  {
    version: "2.4.0",
    date: "April 20, 2026",
    title: "Custom Domains & API v2",
    changes: [
      { type: "feature", text: "Custom domain support for public status pages on Business plans." },
      { type: "feature", text: "API v2 with improved pagination, filtering, and webhook payloads." },
      { type: "improvement", text: "Status page load time reduced by 40% with server-side rendering." },
      { type: "fix", text: "Fixed timezone offset in incident timeline display." },
    ],
  },
  {
    version: "2.3.0",
    date: "March 8, 2026",
    title: "Multi-Channel Alerting",
    changes: [
      { type: "feature", text: "Slack integration for real-time incident alerts." },
      { type: "feature", text: "Webhook channel with configurable payloads and retry logic." },
      { type: "improvement", text: "Alert routing rules now support monitor tag filters." },
      { type: "improvement", text: "Email alerts now include uptime trend sparkline." },
    ],
  },
  {
    version: "2.2.0",
    date: "January 22, 2026",
    title: "Team Workspaces",
    changes: [
      { type: "feature", text: "Multi-user workspaces with role-based access control." },
      { type: "feature", text: "Team member invitations via email." },
      { type: "improvement", text: "Dashboard performance improvements for 100+ monitors." },
      { type: "security", text: "Added session token rotation on password change." },
    ],
  },
  {
    version: "2.1.0",
    date: "November 15, 2025",
    title: "Billing & Pro Plans",
    changes: [
      { type: "feature", text: "Stripe-powered billing with Pro and Business tiers." },
      { type: "feature", text: "Customer billing portal for invoice and payment method management." },
      { type: "improvement", text: "Monitor creation limit enforced per plan tier." },
      { type: "fix", text: "Fixed edge case where paused monitors still triggered alerts." },
    ],
  },
  {
    version: "2.0.0",
    date: "September 1, 2025",
    title: "Public Status Pages",
    changes: [
      { type: "feature", text: "Create public status pages with a unique slug." },
      { type: "feature", text: "90-day uptime history bars for each monitor." },
      { type: "feature", text: "Incident subscriber notifications via email." },
      { type: "improvement", text: "Completely redesigned dashboard UI with new design system." },
    ],
  },
  {
    version: "1.0.0",
    date: "June 10, 2024",
    title: "Initial Launch",
    changes: [
      { type: "feature", text: "URL monitoring with 1-minute check intervals." },
      { type: "feature", text: "Incident tracking with investigation → resolution lifecycle." },
      { type: "feature", text: "Email alerts for downtime events." },
      { type: "feature", text: "Dashboard with uptime percentages and response time charts." },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-text-primary">Changelog</h1>
        <p className="mt-4 text-lg text-text-secondary">
          New features, improvements, and fixes shipped to PulseOps.
        </p>
      </section>

      <div className="relative border-l-2 border-line-default pl-8 space-y-12">
        {changelog.map((entry) => (
          <article key={entry.version} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-brand-default bg-bg-base" />

            <header className="flex flex-wrap items-baseline gap-3">
              <span className="inline-flex items-center rounded-full bg-brand-default/10 px-2.5 py-0.5 text-xs font-semibold text-brand-default">
                v{entry.version}
              </span>
              <time className="text-sm text-text-tertiary">{entry.date}</time>
            </header>

            <h2 className="mt-3 text-xl font-bold text-text-primary">{entry.title}</h2>

            <ul className="mt-4 space-y-2.5">
              {entry.changes.map((change, i) => {
                const cfg = typeConfig[change.type]
                const Icon = cfg.icon
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shrink-0 ${cfg.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                    <span className="text-sm text-text-secondary leading-relaxed">{change.text}</span>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
