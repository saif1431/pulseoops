"use client"

import * as React from "react"
import { Shield, Trash2, Camera, Lock } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal"

interface ProfileClientProps {
  user: {
    name: string
    email: string
    image?: string
  }
}

function getInitials(name: string, email: string) {
  const base = name?.trim() || email?.split("@")[0] || "U"
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
  }
  return (parts[0]?.[0] ?? "U").toUpperCase()
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [name, setName] = React.useState(user.name)
  const initials = getInitials(user.name, user.email)
  const [saving, setSaving] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("")

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Mock API call
    setTimeout(() => {
      setSaving(false)
      toast.success("Profile updated successfully")
    }, 800)
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "DELETE") {
      toast.error("Account deletion requested")
      // Logic for actual delete
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and how others see you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-line-default/50">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-brand-subtle flex items-center justify-center border-2 border-brand-default/20 overflow-hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-brand-default">
                      {initials}
                    </span>
                  )}
                </div>
                <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-medium text-text-primary mb-1">Your avatar</h4>
                <p className="text-xs text-text-secondary mb-3">Upload a new photo or use Gravatar. PNG, JPG max 5MB.</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button variant="outline" size="sm">Upload photo</Button>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <Input 
                label="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. John Doe"
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary leading-none">Email Address</label>
                <div className="flex items-center gap-3">
                  <Input 
                    value={user.email} 
                    disabled 
                    className="bg-bg-base opacity-70 flex-1"
                  />
                  <Badge className="bg-status-up/10 text-status-up border-status-up/20 px-2 py-1">
                    <Shield className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary">Email can only be changed via security settings.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" type="submit" loading={saving}>Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Keep your account secure by using a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Current Password" type="password" required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="New Password" type="password" required />
              <Input label="Confirm New Password" type="password" required />
            </div>
            <div className="h-1.5 w-full bg-bg-base rounded-full overflow-hidden mt-1">
              <div className="h-full w-2/3 bg-status-up rounded-full" />
            </div>
            <p className="text-xs text-text-secondary">Password strength: <span className="text-status-up font-medium">Strong</span></p>
            <div className="flex justify-end pt-4">
              <Button variant="outline" leftIcon={<Lock className="h-4 w-4" />}>Update password</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-status-down/30">
        <CardHeader>
          <CardTitle className="text-status-down">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-status-down/5 border border-status-down/10">
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary text-left">Delete this account</p>
              <p className="text-xs text-text-secondary text-left">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)} leftIcon={<Trash2 className="h-4 w-4" />}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="text-status-down">Delete Account</ModalTitle>
            <ModalDescription>
              This action is permanent and cannot be undone. All your monitors, incidents, and status pages will be lost.
            </ModalDescription>
          </ModalHeader>
          <div className="py-6 space-y-4">
            <p className="text-sm text-text-primary">Please type <span className="font-bold text-text-primary select-none">DELETE</span> to confirm.</p>
            <Input 
              placeholder="Type DELETE" 
              value={deleteConfirmText} 
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
          </div>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              disabled={deleteConfirmText !== "DELETE"} 
              onClick={handleDeleteAccount}
            >
              Confirm Deletion
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
