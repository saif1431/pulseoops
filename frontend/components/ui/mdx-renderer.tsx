import React from 'react';

/**
 * MDXRenderer Component
 * This component handles rendering of markdown-like content.
 * In a real implementation, this would use 'next-mdx-remote' or similar.
 * For now, it handles basic formatting like headers, code blocks, and lists.
 */
export function MDXRenderer({ content }: { content: string }) {
  // Simple transformation for demonstration
  const paragraphs = content.split('\n\n').map((p, i) => {
    // Check for headers
    if (p.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-text-primary mb-4 mt-8">{p.substring(2)}</h1>;
    if (p.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold text-text-primary mb-3 mt-6">{p.substring(3)}</h2>;
    if (p.startsWith('### ')) return <h3 key={i} className="text-xl font-medium text-text-primary mb-2 mt-4">{p.substring(4)}</h3>;
    
    // Check for code blocks
    if (p.startsWith('```')) {
      const code = p.replace(/```[a-z]*\n|```/g, '');
      return (
        <div key={i} className="relative group my-6">
          <pre className="bg-bg-subtle p-4 rounded-lg overflow-x-auto text-sm font-mono text-text-primary border border-line-default">
            <code>{code}</code>
          </pre>
          <button 
            onClick={() => navigator.clipboard.writeText(code)}
            className="absolute top-2 right-2 p-1.5 rounded bg-bg-surface border border-line-default opacity-0 group-hover:opacity-100 transition-opacity text-xs text-text-tertiary hover:text-text-primary"
          >
            Copy
          </button>
        </div>
      );
    }

    // Default paragraph
    return <p key={i} className="text-text-secondary leading-7 mb-4">{p}</p>;
  });

  return <div className="mdx-content">{paragraphs}</div>;
}
