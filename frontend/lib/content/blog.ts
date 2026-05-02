export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: "Product" | "Engineering" | "Reliability" | "Company"
  tags: string[]
  publishedAt: string
  readTime: string
  body: string[]
  content?: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-pulseops",
    title: "Introducing PulseOps",
    excerpt: "A modern reliability workspace for uptime monitoring, incidents, and status communication.",
    category: "Product",
    tags: ["launch", "product"],
    publishedAt: "2026-04-01",
    readTime: "4 min read",
    body: [
      "Today we are launching PulseOps to help teams monitor and communicate service reliability with less friction.",
      "We built one flow from monitoring to incident response to public status updates.",
      "This release includes monitor checks, incident tracking, and billing-ready plans.",
    ],
    content: `
## Welcome to PulseOps

Today we are launching PulseOps to help teams monitor and communicate service reliability with less friction. We built one flow from monitoring to incident response to public status updates.

### What is in this release?

* **Monitor Checks**: Global URL health checks.
* **Incident Tracking**: Manage the full lifecycle of an outage.
* **Status Pages**: Communicate clearly with your customers.
* **Billing**: Production-ready Stripe integration.

### Example Code

To use our API, you can send a simple POST request:

\`\`\`javascript
const res = await fetch('https://api.pulseops.io/v1/monitors', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_KEY' },
  body: JSON.stringify({ name: 'My Website', url: 'https://example.com' })
});
\`\`\`
    `
  },
  {
    slug: "how-we-design-status-pages",
    title: "How We Design Better Status Pages",
    excerpt: "Design principles for transparent communication during outages.",
    category: "Reliability",
    tags: ["status pages", "communication"],
    publishedAt: "2026-04-08",
    readTime: "6 min read",
    body: [
      "Good status pages are clear, fast, and honest.",
      "Users should quickly understand impact, timeline, and next expected update.",
      "PulseOps status templates prioritize readability and trust.",
    ],
  },
  {
    slug: "reducing-alert-noise",
    title: "Reducing Alert Noise Without Missing Incidents",
    excerpt: "Practical threshold and channel strategies for healthy on-call workflows.",
    category: "Engineering",
    tags: ["alerts", "on-call"],
    publishedAt: "2026-04-15",
    readTime: "7 min read",
    body: [
      "Too many alerts create fatigue and hide what matters.",
      "A combination of failure thresholds and grouped channels helps improve response quality.",
      "PulseOps allows progressive escalation from email to Slack and webhooks.",
    ],
  },
  {
    slug: "behind-the-scenes-check-engine",
    title: "Behind the Scenes of Our Check Engine",
    excerpt: "How we think about check intervals, latency, and monitor consistency.",
    category: "Engineering",
    tags: ["checks", "latency"],
    publishedAt: "2026-04-20",
    readTime: "5 min read",
    body: [
      "Our check engine balances speed and stability across plans.",
      "Business plans get the tightest intervals while preserving backend efficiency.",
      "We continue improving regional coverage and anomaly detection.",
    ],
  },
  {
    slug: "team-collaboration-roadmap",
    title: "Team Collaboration Roadmap",
    excerpt: "What is next for role-based workflows, ownership, and approvals.",
    category: "Company",
    tags: ["roadmap", "teams"],
    publishedAt: "2026-04-24",
    readTime: "3 min read",
    body: [
      "We are expanding team workflows for larger orgs.",
      "Upcoming updates include better assignment, runbooks, and approvals.",
      "Feedback from early users directly shapes this roadmap.",
    ],
  },
]

export const blogTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags))).sort()
