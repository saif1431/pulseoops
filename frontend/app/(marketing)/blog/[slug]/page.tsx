import { notFound } from "next/navigation"

import { blogPosts } from "@/lib/content/blog"
import { MDXRenderer } from "@/components/ui/mdx-renderer"

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((entry) => entry.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-text-tertiary">{post.category}</p>
      <h1 className="mt-3 text-4xl font-bold text-text-primary">{post.title}</h1>
      <p className="mt-2 text-sm text-text-secondary">
        {new Date(post.publishedAt).toLocaleDateString()} • {post.readTime}
      </p>
      <p className="mt-6 text-lg text-text-secondary">{post.excerpt}</p>

      <div className="mt-10">
        <MDXRenderer content={post.content || post.body.join('\n\n')} />
      </div>
    </article>
  )
}
