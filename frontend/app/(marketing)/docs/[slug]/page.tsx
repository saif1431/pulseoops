import Link from "next/link"
import { notFound } from "next/navigation"

import { CodeSnippet } from "@/components/docs/code-snippet"
import { MDXRenderer } from "@/components/ui/mdx-renderer"
import { docsBySlug, docsPages } from "@/lib/content/docs"

export default async function DocDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = docsBySlug[slug]

  if (!doc) {
    notFound()
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-20 pt-28 lg:grid-cols-[270px_1fr] lg:gap-12 lg:pt-32">
      <aside className="h-fit rounded-2xl border border-line-default bg-bg-surface p-5 lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">Documentation</p>
        <nav className="mt-4 space-y-1.5">
          {docsPages.map((entry) => (
            <Link
              key={entry.slug}
              href={`/docs/${entry.slug}`}
              className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                entry.slug === slug
                  ? "bg-brand-subtle text-brand-primary"
                  : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
              }`}
            >
              {entry.title}
            </Link>
          ))}
        </nav>
      </aside>

      <article className="space-y-8">
        <header className="rounded-2xl border border-line-default bg-white p-7 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">{doc.category}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{doc.title}</h1>
          <p className="mt-3 max-w-3xl text-base text-text-secondary sm:text-lg">{doc.description}</p>
        </header>

        {doc.content ? (
          <div className="rounded-2xl border border-line-default bg-white p-6 shadow-sm sm:p-8">
            <MDXRenderer content={doc.content} />
          </div>
        ) : (
          doc.sections.map((section) => (
            <section key={section.heading} className="space-y-4 rounded-2xl border border-line-default bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-text-primary sm:text-2xl">{section.heading}</h2>
              <p className="text-base leading-7 text-text-secondary">{section.body}</p>
              {section.code && <CodeSnippet language={section.code.language} code={section.code.content} />}
            </section>
          ))
        )}
      </article>
    </div>
  )
}
