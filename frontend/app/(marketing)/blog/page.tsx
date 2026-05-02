"use client"

import * as React from "react"
import Link from "next/link"

import { blogPosts, blogTags } from "@/lib/content/blog"

const PAGE_SIZE = 3

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = React.useState<string>("all")
  const [page, setPage] = React.useState(1)

  const filtered = blogPosts.filter((post) => selectedTag === "all" || post.tags.includes(selectedTag))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(1)
    }
  }, [page, totalPages])

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tight">Latest from the Blog</h1>
        <p className="mt-6 text-xl text-text-secondary max-w-2xl mx-auto font-medium">
          Updates on product releases, reliability practices, and engineering notes from the PulseOps team.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setSelectedTag("all")}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${selectedTag === "all" ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : "bg-white text-text-secondary border border-line-default hover:border-brand-primary hover:text-brand-primary"}`}
        >
          All Posts
        </button>
        {blogTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${selectedTag === tag ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : "bg-white text-text-secondary border border-line-default hover:border-brand-primary hover:text-brand-primary"}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col justify-between rounded-[32px] border border-line-default bg-white p-8 shadow-sm hover:shadow-premium transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(88,80,236,0.08),transparent)] pointer-events-none" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand-subtle text-brand-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{post.category}</span>
                <span className="text-text-tertiary text-xs font-bold">{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-black text-text-primary tracking-tight group-hover:text-brand-primary transition-colors mb-4 leading-tight">{post.title}</h2>
              <p className="text-base text-text-secondary font-medium leading-relaxed mb-8">{post.excerpt}</p>
            </div>
            
            <div className="pt-6 border-t border-line-default/50 flex items-center justify-between">
              <span className="text-sm font-bold text-text-primary">{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span className="text-brand-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold text-sm flex items-center gap-1">Read article &rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded-md border border-line-default px-3 py-1.5 text-sm text-text-primary disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-text-secondary">Page {page} of {totalPages}</p>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="rounded-md border border-line-default px-3 py-1.5 text-sm text-text-primary disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
