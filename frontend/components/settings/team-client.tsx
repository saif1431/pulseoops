"use client"

import * as React from "react"
import { Users, Mail, UserPlus, Shield, Trash2, ShieldCheck, Crown, Info } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UpgradePrompt } from "@/components/billing/upgrade-prompt"

interface TeamClientProps {
  plan: "FREE" | "PRO" | "BUSINESS"
}

const mockMembers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Owner", joined: "Jan 12, 2024" },
  { id: "2", name: "Sarah Smith", email: "sarah@example.com", role: "Admin", joined: "Feb 05, 2024" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "Member", joined: "Mar 20, 2024" },
]

const mockInvites = [
  { id: "inv-1", email: "alex@company.com", role: "Member", sent: "2 days ago" },
]

export function TeamClient({ plan }: TeamClientProps) {
  const isPro = plan !== "FREE"
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviting, setInviting] = React.useState(false)

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setTimeout(() => {
      setInviting(false)
      toast.success(`Invite sent to ${inviteEmail}`)
      setInviteEmail("")
    }, 800)
  }

  if (!isPro) {
    return (
      <div className="space-y-6 py-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-brand-subtle flex items-center justify-center border-4 border-brand-default/10">
            <Users className="h-6 w-6 text-brand-default" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Team management</h2>
            <p className="text-sm text-text-secondary">Invite colleagues and collaborate on incidents together.</p>
          </div>
        </div>
        <Badge className="w-fit bg-brand-default/10 text-brand-default border-none">PRO+</Badge>
        <UpgradePrompt feature="Team collaboration" requiredPlan="PRO" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Role Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-bg-surface border border-line-default shadow-sm">
        <Info className="h-5 w-5 text-brand-default shrink-0 mt-0.5" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Crown className="h-3 w-3 text-status-degraded" /> Owner
            </p>
            <p className="text-xs text-text-secondary">Full access, billing, workspace deletion.</p>
          </div>
          <div className="space-y-1 border-l border-line-default/50 pl-6">
            <p className="text-xs font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3 text-brand-default" /> Admin
            </p>
            <p className="text-xs text-text-secondary">Manage monitors, pages, and incidents.</p>
          </div>
          <div className="space-y-1 border-l border-line-default/50 pl-6">
            <p className="text-xs font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="h-3 w-3 text-text-tertiary" /> Member
            </p>
            <p className="text-xs text-text-secondary">View only access to all dashboard data.</p>
          </div>
        </div>
      </div>

      {/* Invite Form */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Member</CardTitle>
          <CardDescription>Add a new team member by email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="colleague@company.com" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div className="w-full sm:w-40">
              <select className="flex h-9 w-full rounded-md border border-line-default bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:border-border-focus focus-visible:ring-brand-focus focus-visible:shadow-[0_0_0_3px_rgba(37,99,235,0.3)]">
                <option className="bg-bg-surface text-text-primary">Member</option>
                <option className="bg-bg-surface text-text-primary">Admin</option>
              </select>
            </div>
            <Button variant="primary" type="submit" loading={inviting} leftIcon={<UserPlus className="h-4 w-4" />}>
              Send invite
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your current team members and their roles.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand-subtle flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-brand-default">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">{member.name}</span>
                        <span className="text-xs text-text-secondary font-mono">{member.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral" className="bg-bg-base text-text-secondary border-line-default px-2 py-0.5">
                      {member.role === "Owner" && <Crown className="h-3 w-3 mr-1 text-status-degraded" />}
                      {member.role === "Admin" && <ShieldCheck className="h-3 w-3 mr-1 text-brand-default" />}
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">{member.joined}</TableCell>
                  <TableCell className="text-right">
                    {member.role !== "Owner" && (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-tertiary hover:text-text-primary">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-tertiary hover:text-status-down">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Invites */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invites</CardTitle>
          <CardDescription>Invites that haven&apos;t been accepted yet.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {mockInvites.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="text-sm text-text-primary font-mono">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="neutral" className="bg-bg-base text-text-secondary border-line-default px-2 py-0.5">
                        {invite.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{invite.sent}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">Resend</Button>
                        <Button variant="ghost" size="sm" className="text-status-down">Cancel</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Mail className="h-8 w-8 text-text-tertiary mb-3 opacity-50" />
              <p className="text-sm text-text-secondary">No pending invites.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
