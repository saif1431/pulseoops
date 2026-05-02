"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CodeSnippetProps {
  language: string
  code: string
}

export function CodeSnippet({ language, code }: CodeSnippetProps) {
  const [copied, setCopied] = React.useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="rounded-lg border border-line-default overflow-hidden bg-bg-elevated">
      <div className="flex items-center justify-between px-3 py-2 border-b border-line-default bg-bg-subtle">
        <span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{language}</span>
        <Button type="button" size="sm" variant="ghost" onClick={onCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-text-primary font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}
