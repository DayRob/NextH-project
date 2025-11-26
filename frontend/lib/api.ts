"use client"

import { supabase } from "@/lib/supabase"
import type { UserProfile } from "@/types"

export type CreateProfilePayload = {
  name: string
  email: string
  age?: number
  weightKg?: number
  heightCm?: number
  healthGoal?: UserProfile["healthGoal"]
  activityLevel?: UserProfile["activityLevel"]
}

const TABLE = "User"

const withNulls = <T extends Record<string, unknown>>(payload: T) =>
  Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, typeof value === "undefined" ? null : value]))

export async function createProfile(payload: CreateProfilePayload): Promise<UserProfile> {
  const insertData = withNulls(payload)

  const { data, error } = await supabase.from(TABLE).insert(insertData).select().single()

  if (error) {
    throw new Error(error.message || "Impossible de créer le profil")
  }

  return data as UserProfile
}

export async function getProfile(profileId: string): Promise<UserProfile> {
  const { data, error } = await supabase.from(TABLE).select().eq("id", profileId).maybeSingle()

  if (error) {
    throw new Error(error.message || "Profil introuvable")
  }
  if (!data) {
    throw new Error("Profil introuvable")
  }

  return data as UserProfile
}

export async function updateProfile(profileId: string, payload: Partial<CreateProfilePayload>): Promise<UserProfile> {
  const entries = Object.entries(payload).filter(([, value]) => typeof value !== "undefined")

  if (entries.length === 0) {
    const current = await getProfile(profileId)
    return current
  }

  const updates = Object.fromEntries(entries)

  const { data, error } = await supabase.from(TABLE).update(withNulls(updates)).eq("id", profileId).select().single()

  if (error) {
    throw new Error(error.message || "Impossible de mettre à jour le profil")
  }

  return data as UserProfile
}

