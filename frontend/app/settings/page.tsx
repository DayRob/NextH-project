"use client"

import { BadgeCheck, Leaf, Zap } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { ProfileSettings } from "@/components/profile-settings"
import { Card, CardContent } from "@/components/ui/card"
import { calculateHealthMetrics } from "@/utils/health-calculator"
import { useProfile } from "@/hooks/use-profile"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const { profile, loading, setProfile, profileId } = useProfile()
  const metrics = calculateHealthMetrics([])

  const metricCards = [
    { label: "Minutes actives / semaine", value: metrics.weeklyExerciseMinutes, icon: Zap },
    { label: "Heures de sommeil moyennes", value: metrics.averageSleepHours.toFixed(1), icon: Leaf },
    { label: "Minutes méditation", value: metrics.weeklyMeditationMinutes, icon: BadgeCheck },
  ]

  if (loading) {
    return <p className="text-center text-white">Chargement du profil...</p>
  }

  if (!profileId || !profile) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-10 text-center text-white">
        <p className="text-2xl font-semibold mb-2">Aucun profil trouvé</p>
        <p className="text-sm text-slate-300 mb-4">Créez votre profil pour accéder aux réglages avancés.</p>
        <Button asChild className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <Link href="/onboarding">Créer mon profil</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Profil & préférences"
        description="Ajustez vos paramètres biométriques et vos objectifs pour alimenter les futures recommandations."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <ProfileSettings profile={profile} onUpdateProfile={(updated) => setProfile(updated)} />
        <div className="space-y-4">
          {metricCards.map((card) => (
            <Card key={card.label} className="border border-white/10 bg-white/5 text-white">
              <CardContent className="flex items-center gap-4 p-5">
                <card.icon className="h-8 w-8 text-cyan-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{card.label}</p>
                  <p className="text-2xl font-semibold">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

