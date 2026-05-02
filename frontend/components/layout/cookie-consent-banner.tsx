"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"

const COOKIE_KEY = "pulseops_cookie_preferences"

type CookiePreferences = {
  essential: true
  analytics: boolean
  marketing: boolean
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
}

export function CookieConsentBanner() {
  const [visible, setVisible] = React.useState(false)
  const [openPreferences, setOpenPreferences] = React.useState(false)
  const [preferences, setPreferences] = React.useState<CookiePreferences>(defaultPreferences)

  React.useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY)
    if (!stored) {
      setVisible(true)
      return
    }

    try {
      setPreferences(JSON.parse(stored) as CookiePreferences)
    } catch {
      setVisible(true)
    }
  }, [])

  const savePreferences = (next: CookiePreferences) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(next))
    setPreferences(next)
    setVisible(false)
    setOpenPreferences(false)
  }

  if (!visible) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-[70] rounded-lg border border-line-default bg-bg-surface p-4 shadow-glow-brand md:left-auto md:max-w-xl">
        <p className="text-sm text-text-primary">
          We use cookies to improve performance, analytics, and product experience.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={() => savePreferences({ essential: true, analytics: true, marketing: true })}>
            Accept all
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => savePreferences({ essential: true, analytics: false, marketing: false })}>
            Essential only
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setOpenPreferences(true)}>
            Preferences
          </Button>
        </div>
      </div>

      <Modal open={openPreferences} onOpenChange={setOpenPreferences}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Cookie Preferences</ModalTitle>
            <ModalDescription>Choose how PulseOps stores optional cookies.</ModalDescription>
          </ModalHeader>
          <div className="space-y-3 py-2">
            <label className="flex items-center justify-between rounded-md border border-line-default p-3">
              <span className="text-sm text-text-primary">Essential</span>
              <input type="checkbox" checked readOnly />
            </label>
            <label className="flex items-center justify-between rounded-md border border-line-default p-3">
              <span className="text-sm text-text-primary">Analytics</span>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))}
              />
            </label>
            <label className="flex items-center justify-between rounded-md border border-line-default p-3">
              <span className="text-sm text-text-primary">Marketing</span>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
              />
            </label>
          </div>
          <ModalFooter>
            <Button type="button" variant="ghost" onClick={() => setOpenPreferences(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => savePreferences(preferences)}>
              Save preferences
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
