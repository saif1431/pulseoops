import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 bg-bg-base text-text-primary animate-in fade-in duration-500">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-bg-surface border border-line-default mb-8 shadow-sm">
        <Compass className="h-12 w-12 text-text-tertiary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Page not found</h2>
      <p className="text-text-secondary max-w-md mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or doesn&apos;t exist.
      </p>
      <Link href="/dashboard" tabIndex={-1}>
        <Button variant="primary" size="lg">
          Go to dashboard
        </Button>
      </Link>
    </div>
  )
}
