"use client"

import { useEffect, useState } from "react"

export function useProfileId() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedId = window.localStorage.getItem("profileId")
    setProfileId(storedId)
    setReady(true)
  }, [])

  return { profileId, ready }
}

