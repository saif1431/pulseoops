"use client"

import * as React from "react"
import Link from "next/link"
import { Globe, Plus, MoreVertical, Layout, Users, ExternalLink } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Monitor } from "@/lib/types"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { UpgradePrompt } from "@/components/billing/upgrade-prompt"

interface StatusPagesClientProps {
  statusPages: Array<{
    id: string
    title: string
    slug: string
    monitorCount?: number
    subscriberCount?: number
  }>
  planLimits: number
  allMonitors: Monitor[]
}

export function StatusPagesClient({ statusPages, planLimits, allMonitors }: StatusPagesClientProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [selectedMonitors, setSelectedMonitors] = React.useState<string[]>([])
  const atLimit = planLimits !== -1 && statusPages.length >= planLimits
  const limitLabel = planLimits === -1 ? "Unlimited" : String(planLimits)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save logic, then redirect
    setOpen(false)
    router.push(`/status-pages/${slug}`) // Assuming creation works or redirects to edit
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Status Pages</h1>
          <p className="text-sm text-text-secondary">
            Communicate downtime to your customers. {statusPages.length}/{limitLabel} pages used.
          </p>
        </div>
        
        {atLimit ? (
          <Button variant="primary" disabled title="Upgrade to add more status pages" onClick={() => router.push('/pricing')}>
            Create status page
          </Button>
        ) : (
          <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                Create status page
              </Button>
            </ModalTrigger>
            <ModalContent>
              <form onSubmit={handleSubmit}>
                <ModalHeader>
                  <ModalTitle>Create Status Page</ModalTitle>
                  <ModalDescription>
                    Configure a public dashboard to communicate your system status.
                  </ModalDescription>
                </ModalHeader>
                
                <div className="grid gap-6 py-6">
                  <Input 
                    label="Page Name" 
                    placeholder="e.g. Acme Status" 
                    required
                    value={name}
                    onChange={handleNameChange}
                  />
                  <Input 
                    label="URL Slug" 
                    placeholder="acme-status" 
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  />
                  <div className="text-xs text-text-secondary -mt-4 pl-1">
                    Your page will be hosted at: <span className="font-mono text-text-primary">status.pulseops.com/{slug || "slug"}</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-text-primary">Included Monitors</label>
                    <div className="max-h-50 overflow-y-auto space-y-2 p-1">
                      {allMonitors.length > 0 ? (
                        allMonitors.map((m) => (
                          <label key={m.id} className="flex items-center gap-3 p-2 rounded-md border border-line-default hover:bg-bg-subtle cursor-pointer transition-colors">
                            <input 
                              type="checkbox" 
                              className="rounded border-line-default text-brand-default focus:ring-brand-focus h-4 w-4"
                              checked={selectedMonitors.includes(m.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedMonitors([...selectedMonitors, m.id])
                                else setSelectedMonitors(selectedMonitors.filter(id => id !== m.id))
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-text-primary">{m.name}</span>
                              <span className="text-xs text-text-secondary font-mono">{m.url}</span>
                            </div>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-text-secondary py-4 text-center">No monitors to select.</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <ModalFooter>
                  <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Create page
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        )}
      </div>

      {atLimit && <UpgradePrompt feature="Additional status pages" requiredPlan="PRO" />}

      {statusPages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-line-default rounded-lg bg-bg-surface text-center">
          <div className="h-12 w-12 rounded-full bg-bg-elevated flex items-center justify-center mb-4 border border-line-default">
            <Globe className="h-6 w-6 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">No status pages</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-md">Create a public page to show your system&apos;s uptime and communicate with your customers during incidents.</p>
          {atLimit ? (
            <Button variant="primary" disabled title="Upgrade to add more status pages">
              Create status page
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setOpen(true)}>
              Create status page
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statusPages.map((page) => (
            <Card key={page.id} className="flex flex-col hover:border-brand-default/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{page.title}</CardTitle>
                    <a href={`#`} className="text-xs text-text-secondary hover:text-brand-default mt-1 flex items-center gap-1 font-mono transition-colors">
                      {page.slug}.status.example.com
                    </a>
                  </div>
                  <button className="text-text-tertiary hover:text-text-primary transition-colors p-1 -mr-2 -mt-2">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-6 text-sm text-text-secondary mt-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                      <span className="font-medium text-text-primary">{page.monitorCount || 0}</span> monitors
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                      <span className="font-medium text-text-primary">{page.subscriberCount || 0}</span> subs
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-line-default">
                  <Link 
                    href={`/status-pages/${page.id}`}
                    className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                  >
                    Edit Page
                  </Link>
                  <Link 
                    href={`/status/${page.slug}`}
                    target="_blank"
                    className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                    title="View Public Page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
