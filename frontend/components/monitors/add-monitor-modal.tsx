"use client"

import * as React from "react"
import { Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal"

import { type CreateMonitorInput } from "@/lib/api/monitors"
import { toast } from "sonner"
import { usePlan } from "@/lib/use-plan"
import { UpgradePrompt } from "@/components/billing/upgrade-prompt"

export function AddMonitorModal({
  onSuccess,
  currentCount = 0,
  createAction,
}: {
  onSuccess?: () => void
  currentCount?: number
  createAction: (data: CreateMonitorInput) => Promise<unknown>
}) {
  const router = useRouter()
  const { isPro, isBusiness, canAddMonitor } = usePlan()
  const canCreate = canAddMonitor(currentCount)
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [interval, setIntervalValue] = React.useState("5")
  const [expectedStatusCode, setExpectedStatusCode] = React.useState("200")

  const validateUrl = (value: string) => {
    if (!value) return true
    try {
      new URL(value.includes("://") ? value : `https://${value}`)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canCreate) {
      setError("Upgrade to add more monitors")
      return
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (e.g. https://example.com)")
      return
    }
    setError("")
    setLoading(true)
    
    try {
      const intervalSeconds = Math.round(Number(interval) * 60)
      const payload: CreateMonitorInput = {
        name,
        url: url.includes("://") ? url : `https://${url}`,
        interval_seconds: intervalSeconds,
        expected_status_code: Number(expectedStatusCode) || 200,
      }
      await createAction(payload)
      toast.success("Monitor added successfully")
      setOpen(false)
      router.refresh()
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create monitor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          disabled={!canCreate}
          title={!canCreate ? "Upgrade to add more monitors" : undefined}
        >
          Add monitor
        </Button>
      </ModalTrigger>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Add new monitor</ModalTitle>
            <ModalDescription>
              Set up a new endpoint to monitor its uptime and performance.
            </ModalDescription>
          </ModalHeader>
          
          <div className="grid gap-6 py-6">
            <Input 
              label="Monitor Name" 
              placeholder="e.g. Marketing Website" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <Input 
              label="URL or IP Address" 
              placeholder="https://example.com" 
              required
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError("")
              }}
              errorMessage={error}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary leading-none">Check Interval</label>
                <select
                  className="flex h-9 w-full rounded-md border border-line-default bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:border-border-focus focus-visible:ring-brand-focus focus-visible:shadow-[0_0_0_3px_rgba(37,99,235,0.3)]"
                  value={interval}
                  onChange={(e) => setIntervalValue(e.target.value)}
                >
                  {isBusiness && <option value="0.5" className="bg-bg-surface">Every 30 seconds</option>}
                  {isPro && <option value="1" className="bg-bg-surface">Every 1 minute</option>}
                  <option value="5" className="bg-bg-surface">Every 5 minutes</option>
                  <option value="15" className="bg-bg-surface">Every 15 minutes</option>
                  <option value="30" className="bg-bg-surface">Every 30 minutes</option>
                  <option value="60" className="bg-bg-surface">Every 1 hour</option>
                </select>
              </div>
              
              <Input 
                label="Expected Status Code" 
                placeholder="200" 
                value={expectedStatusCode}
                onChange={(e) => setExpectedStatusCode(e.target.value)}
              />
            </div>

            {!isPro && <UpgradePrompt feature="1-minute checks" requiredPlan="PRO" />}
            {!isBusiness && <UpgradePrompt feature="30-second checks" requiredPlan="BUSINESS" />}
          </div>
          
          <ModalFooter>
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!canCreate || loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving monitor...
                </span>
              ) : (
                "Save monitor"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
