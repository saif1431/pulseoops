"use server"

import { revalidatePath } from "next/cache"

import {
  createMonitor,
  deleteMonitor,
  pauseMonitor,
  updateMonitor,
  type CreateMonitorInput,
  type Monitor,
  type UpdateMonitorInput,
} from "@/lib/api/monitors"

export async function createMonitorAction(data: CreateMonitorInput): Promise<Monitor> {
  const monitor = await createMonitor(data)
  revalidatePath("/dashboard/monitors")
  revalidatePath("/dashboard")
  return monitor
}

export async function updateMonitorAction(id: string, data: UpdateMonitorInput): Promise<Monitor> {
  const monitor = await updateMonitor(id, data)
  revalidatePath("/dashboard/monitors")
  revalidatePath("/dashboard")
  return monitor
}

export async function deleteMonitorAction(id: string): Promise<void> {
  await deleteMonitor(id)
  revalidatePath("/dashboard/monitors")
  revalidatePath("/dashboard")
}

export async function pauseMonitorAction(id: string): Promise<Monitor> {
  const monitor = await pauseMonitor(id)
  revalidatePath("/dashboard/monitors")
  revalidatePath("/dashboard")
  return monitor
}
