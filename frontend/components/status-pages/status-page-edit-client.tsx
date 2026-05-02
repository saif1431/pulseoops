"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Save, Globe, Eye, EyeOff, GripVertical, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Monitor } from "@/lib/types"
import { StatusDot } from "@/components/ui/status-dot"
import { cn } from "@/lib/utils"

interface EditableStatusPage {
  id: string
  title: string
  slug: string
}

interface StatusPageEditClientProps {
  statusPage: EditableStatusPage
  allMonitors: Monitor[]
}

export function StatusPageEditClient({ statusPage, allMonitors }: StatusPageEditClientProps) {
  const router = useRouter()
  const [name, setName] = React.useState(statusPage.title)
  const [slug, setSlug] = React.useState(statusPage.slug)
  const [loading, setLoading] = React.useState(false)
  const [monitors, setMonitors] = React.useState(allMonitors.map(m => ({ ...m, visible: true })))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Mock save
    setTimeout(() => {
      setLoading(false)
      router.push("/status-pages")
    }, 500)
  }

  const toggleVisibility = (id: string) => {
    setMonitors(monitors.map(m => m.id === id ? { ...m, visible: !m.visible } : m))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <Link href="/status-pages" className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to pages
        </Link>
        <Link 
          href={`/status/${statusPage.slug}`} 
          target="_blank" 
          rel="noreferrer" 
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-brand-default")}
        >
          <Globe className="mr-2 h-4 w-4" /> View Public Page
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line-default">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit &quot;{statusPage.title}&quot;</h1>
          <p className="text-sm text-text-secondary mt-1 font-mono">{slug}.status.example.com</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<AlertTriangle className="h-4 w-4 text-status-degraded" />}>
            Post manual incident
          </Button>
          <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={handleSave} loading={loading}>
            Save changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
              <CardDescription>Public information shown on your status page.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <Input 
                  label="Page Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input 
                  label="URL Slug" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary leading-none">Description (Optional)</label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-line-default bg-transparent px-3 py-2 text-sm text-text-primary shadow-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:border-border-focus focus-visible:ring-brand-focus resize-y"
                    placeholder="Welcome to our system status page. Here you'll find real-time information..."
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitors Shown</CardTitle>
              <CardDescription>Select and reorder which monitors appear on this page.</CardDescription>
            </CardHeader>
            <CardContent>
              {monitors.length > 0 ? (
                <div className="space-y-2">
                  {monitors.map((monitor) => (
                    <div 
                      key={monitor.id} 
                      className={`flex items-center justify-between p-3 rounded-md border transition-colors ${monitor.visible ? 'border-line-default bg-bg-surface' : 'border-dashed border-line-default bg-bg-base opacity-60'}`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-text-tertiary cursor-move hover:text-text-primary" />
                        <StatusDot status={monitor.status} />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{monitor.name}</p>
                          <p className="text-xs text-text-secondary font-mono">{monitor.url}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={monitor.visible ? 'text-brand-default' : 'text-text-secondary'}
                        onClick={() => toggleVisibility(monitor.id)}
                      >
                        {monitor.visible ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                        {monitor.visible ? 'Visible' : 'Hidden'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary py-4 text-center">No monitors available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-md border border-brand-default/30 bg-brand-default/5">
                <Globe className="h-5 w-5 text-brand-default shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Public</p>
                  <p className="text-xs text-text-secondary mt-1">Anyone with the link can view this page.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-md border border-dashed border-line-default opacity-60 cursor-not-allowed">
                <EyeOff className="h-5 w-5 text-text-tertiary shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">Password Protected</p>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-default bg-brand-default/10 px-1.5 rounded">Pro</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Require a password to view.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>Use your own domain for this status page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-line-default bg-bg-elevated p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-default" />
                  <p className="text-sm font-medium text-text-primary">status.yourdomain.com</p>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Point a CNAME record to <code className="px-1 py-0.5 rounded bg-bg-subtle text-text-primary font-mono text-[11px]">status.pulseops.io</code> and enter your domain below.
                </p>
                <Input
                  placeholder="status.yourdomain.com"
                  helperText="Available on Business plan"
                  disabled
                />
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-default bg-brand-default/10 px-1.5 py-0.5 rounded">Business</span>
                  <a href="/pricing" className="text-brand-default hover:text-brand-hover font-medium">
                    Upgrade to enable
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-status-down/30">
            <CardHeader>
              <CardTitle className="text-status-down">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-4">
                Deleting this status page is permanent. Your monitors and incident history will not be deleted.
              </p>
              <Button variant="danger" className="w-full">Delete status page</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
