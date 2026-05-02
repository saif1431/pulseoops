export interface DocPage {
  slug: string
  title: string
  category: "Getting Started" | "Authentication" | "Monitoring APIs" | "Incidents APIs" | "Status Pages APIs" | "Billing"
  description: string
  sections: Array<{
    heading: string
    body: string
    code?: { language: string; content: string }
  }>
  content?: string
}

export const docsPages: DocPage[] = [
  {
    slug: "quickstart",
    title: "Quickstart",
    category: "Getting Started",
    description: "Set up workspace, add first monitor, and publish your status page in minutes.",
    sections: [
      {
        heading: "1. Create your account",
        body: "Register, verify your email, and sign in. You can then create your first monitor from the dashboard.",
      },
      {
        heading: "2. Add your first monitor",
        body: "Use URL monitoring to begin tracking uptime and latency.",
        code: {
          language: "bash",
          content: "curl -X POST https://api.pulseops.io/api/monitors \\\n  -H 'Authorization: Bearer <token>' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"Marketing Site\",\"url\":\"https://example.com\"}'",
        },
      },
      {
        heading: "3. Configure alerts",
        body: "Enable email first, then add Slack/Webhook channels when your plan allows.",
      },
    ],
  },
  {
    slug: "auth",
    title: "Authentication",
    category: "Authentication",
    description: "Use bearer tokens issued by Auth.js session to authenticate backend requests.",
    sections: [
      {
        heading: "Bearer tokens",
        body: "All private API routes require an Authorization header.",
        code: {
          language: "http",
          content: "Authorization: Bearer <access_token>",
        },
      },
      {
        heading: "Token refresh",
        body: "When a token is invalid/expired, the frontend signs users out and redirects to /login.",
      },
    ],
  },
  {
    slug: "monitors-api",
    title: "Monitors API",
    category: "Monitoring APIs",
    description: "Create, list, pause, and delete monitors.",
    sections: [
      {
        heading: "List monitors",
        body: "Fetch all monitors for your workspace.",
        code: {
          language: "bash",
          content: "curl https://api.pulseops.io/api/monitors -H 'Authorization: Bearer <token>'",
        },
      },
      {
        heading: "Pause a monitor",
        body: "Temporarily stop checks without deleting configuration.",
      },
    ],
  },
  {
    slug: "incidents-api",
    title: "Incidents API",
    category: "Incidents APIs",
    description: "Track active incidents and lifecycle updates.",
    sections: [
      {
        heading: "List incidents",
        body: "Get active and resolved incidents for your workspace.",
      },
      {
        heading: "Resolve incident",
        body: "Mark an incident resolved and publish update timeline.",
      },
    ],
  },
  {
    slug: "status-pages-api",
    title: "Status Pages API",
    category: "Status Pages APIs",
    description: "Create and manage public status pages and subscribers.",
    sections: [
      {
        heading: "Create status page",
        body: "Create a public page and bind monitor set.",
      },
      {
        heading: "Public endpoint",
        body: "Read public page data by slug for customer-facing status.",
      },
    ],
  },
  {
    slug: "billing",
    title: "Billing",
    category: "Billing",
    description: "Launch checkout and customer portal sessions.",
    sections: [
      {
        heading: "Checkout session",
        body: "Start Stripe checkout for plan upgrades.",
      },
      {
        heading: "Portal session",
        body: "Open Stripe customer portal for payment method and invoice management.",
      },
    ],
  },
]

export const docsBySlug = Object.fromEntries(docsPages.map((doc) => [doc.slug, doc]))
