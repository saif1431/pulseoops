"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { docsPages } from "@/lib/content/docs"

export default function DocsPage() {
  const [query, setQuery] = React.useState("")

  const filtered = docsPages.filter((doc) => {
    const haystack = `${doc.title} ${doc.description} ${doc.category}`.toLowerCase()
    return haystack.includes(query.toLowerCase())
  })

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pb-28 sm:pt-36">
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">Documentation</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg">
          Search quickstart and API references for auth, monitors, incidents, status pages, and billing.
        </p>
      </div>

      <div className="relative mx-auto mb-12 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-tertiary" />
        </div>
        <input
          type="search"
          placeholder="Search docs, quickstarts, API references..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-14 w-full rounded-2xl border border-line-default bg-white pl-12 pr-6 text-base text-text-primary shadow-sm transition-all placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary hover:shadow-md"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="group flex flex-col rounded-2xl border border-line-default bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-premium"
          >
            <div className="mb-4 inline-flex">
              <span className="rounded-full bg-bg-subtle px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-secondary transition-colors group-hover:bg-brand-subtle group-hover:text-brand-primary">{doc.category}</span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary transition-colors group-hover:text-brand-primary">{doc.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
