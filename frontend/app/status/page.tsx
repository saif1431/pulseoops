import Link from "next/link"
import { Globe } from "lucide-react"

export default function StatusIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-text-primary text-center">System Status</h1>
      <p className="mt-3 text-text-secondary text-center">
        Open a published status page with your workspace slug.
      </p>

      <form className="mt-8 rounded-lg border border-line-default bg-bg-surface p-4" action="/status" method="get">
        <label htmlFor="slug" className="text-sm font-medium text-text-primary">Status page slug</label>
        <div className="mt-2 flex gap-2">
          <input
            id="slug"
            name="slug"
            required
            placeholder="acme-status"
            className="h-10 flex-1 rounded-md border border-line-default bg-bg-base px-3 text-sm text-text-primary"
          />
          <button
            type="submit"
            className="h-10 rounded-md bg-brand-default px-4 text-sm font-medium text-white hover:bg-brand-hover"
            onClick={(e) => {
              const form = e.currentTarget.form
              const input = form?.querySelector<HTMLInputElement>("#slug")
              if (!input?.value) return
              e.preventDefault()
              window.location.assign(`/status/${input.value}`)
            }}
          >
            Open
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-lg border border-line-default bg-bg-elevated p-4">
        <p className="flex items-center gap-2 text-sm text-text-primary">
          <Globe className="h-4 w-4 text-brand-default" />
          Custom domains for status pages are available on paid plans.
        </p>
      </div>

      <div className="text-center">
        <Link href="/" className="mt-6 inline-block font-medium text-brand-default hover:text-brand-hover">
          Back to home
        </Link>
      </div>
    </div>
  )
}
