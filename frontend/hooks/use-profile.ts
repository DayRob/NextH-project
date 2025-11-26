"use client"

import { useCallback, useEffect, useState } from "react"
import type { UserProfile } from "@/types"
import { getProfile } from "@/lib/api"
import { useProfileId } from "./use-profile-id"

export function useProfile() {
  const { profileId, ready } = useProfileId()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!profileId) return
    setLoading(true)
    try {
      const data = await getProfile(profileId)
      setProfile(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger le profil")
    } finally {
      setLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    if (!ready) return
    if (!profileId) {
      setProfile(null)
      setLoading(false)
      return
    }
    refresh()
  }, [ready, profileId, refresh])

  return { profile, profileId, loading, error, refresh, setProfile }
}

