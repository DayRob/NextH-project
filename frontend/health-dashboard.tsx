"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Flame, Moon, Sparkles, SunMedium } from "lucide-react"
import { ActivityDistributionChart } from "./components/activity-distribution-chart"
import { HealthScoreCard } from "./components/health-score-card"
import { HealthSummary } from "./components/health-summary"
import { ProfileSettings } from "./components/profile-settings"
import type { Activity as ActivityType, HealthMetrics, HealthScore, UserProfile } from "./types"
import {
  calculateActivityDistribution,
  calculateHealthMetrics,
  calculateHealthScore,
  generateHealthRecommendations,
} from "./utils/health-calculator"
import { useProfile } from "@/hooks/use-profile"

const emptyMetrics: HealthMetrics = {
  weeklyExerciseMinutes: 0,
  weeklySteps: 0,
  averageSleepHours: 0,
  weeklyReadingHours: 0,
  weeklyMeditationMinutes: 0,
  weeklyOutdoorMinutes: 0,
}

const emptyScore: HealthScore = {
  overall: 0,
  exercise: 0,
  sleep: 0,
  mental: 0,
  lifestyle: 0,
  message: "Créez votre profil pour obtenir un score personnalisé.",
  status: "needs_improvement",
}

export default function HealthDashboard() {
  const { profile, loading, profileId, setProfile } = useProfile()
  const activities: ActivityType[] = [] // Les activités seront branchées sur Supabase plus tard

  const activityDistribution = useMemo(() => calculateActivityDistribution(activities), [activities])
  const healthMetrics = useMemo(
    () => (activities.length ? calculateHealthMetrics(activities) : emptyMetrics),
    [activities],
  )
  const healthRecommendations = useMemo(
    () => (profile ? generateHealthRecommendations(healthMetrics, profile) : []),
    [healthMetrics, profile],
  )
  const healthScore = useMemo(
    () => (profile ? calculateHealthScore(healthMetrics, profile) : emptyScore),
    [healthMetrics, profile],
  )

  const weeklyActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return activityDate >= weekAgo
  }).length

  const totalMinutesThisWeek = activities.reduce((sum, activity) => sum + activity.duration, 0)

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-10 text-center text-white">
        Chargement du profil...
      </div>
    )
  }

  if (!profileId || !profile) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-10 text-center text-white">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-200">
            <Sparkles className="h-3 w-3" />
            Aucune donnée
          </div>
          <h2 className="text-3xl font-semibold">Commencez par créer votre profil bien-être</h2>
          <p className="text-sm text-slate-300">
            Nous utiliserons vos informations pour générer des recommandations adaptées et suivre vos routines.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white"
            href="/onboarding"
          >
            Créer mon profil
          </Link>
        </div>
      </div>
    )
  }

  const heroStats = [
    {
      label: "Score vitalité",
      value: `${healthScore.overall}/100`,
      subLabel: healthScore.status === "excellent" ? "Excellent" : "En construction",
      icon: Flame,
      accent: "from-orange-500/20 to-pink-500/20",
    },
    {
      label: "Minutes actives",
      value: `${Math.round(totalMinutesThisWeek)} min`,
      subLabel: "En attente de nouvelles activités",
      icon: Activity,
      accent: "from-cyan-500/20 to-blue-500/20",
    },
    {
      label: "Routine sommeil",
      value: `${healthMetrics.averageSleepHours.toFixed(1)}h`,
      subLabel: "Ajoutez vos nuits pour suivre la progression",
      icon: Moon,
      accent: "from-emerald-500/20 to-lime-500/20",
    },
  ]

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl shadow-cyan-900/10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-100">
              <Sparkles className="h-3 w-3" />
              Profil activé
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-tight">Bienvenue {profile.name}</h2>
              <p className="text-base text-slate-200">
                Ajoutez vos premières activités pour générer des insights personnalisés et voir cette section prendre vie.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border border-white/10 bg-gradient-to-br ${stat.accent} px-4 py-5 shadow-lg shadow-black/10`}
                >
                  <stat.icon className="mb-3 h-5 w-5 text-white/80" />
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-slate-200">{stat.subLabel}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Activités loggées</p>
                <p className="text-4xl font-semibold">{activities.length}</p>
              </div>
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">7 derniers jours</span>
            </div>
            <div className="mt-6 space-y-4">
              <MetricBar label="Habitudes actives" value={weeklyActivities} trend="Bientôt disponible" accent="bg-cyan-400" />
              <MetricBar
                label="Minutes conscientes"
                value={healthMetrics.weeklyMeditationMinutes + healthMetrics.weeklyReadingHours * 60}
                trend="Connectez vos activités"
                accent="bg-purple-400"
              />
              <MetricBar
                label="Moments outdoor"
                value={healthMetrics.weeklyOutdoorMinutes}
                trend="Ajoutez des marches / sorties"
                accent="bg-emerald-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ActivityDistributionChart data={activityDistribution} />
          <HealthSummary recommendations={healthRecommendations} />
        </div>
        <div className="space-y-8">
          <HealthScoreCard score={healthScore} />
          <ProfileSettings profile={profile} onUpdateProfile={(updated) => setProfile(updated)} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-900/30 text-white">
            <CardContent className="space-y-3 p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200">
                <SunMedium className="h-3 w-3" />
                À venir
              </div>
              <h3 className="text-lg font-semibold">Connectez vos prochaines activités</h3>
              <p className="text-sm text-slate-300">Le suivi détaillé s'activera dès que vous enregistrerez une séance.</p>
              <p className="text-xs text-cyan-200">Fonctionnalité bientôt disponible</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}

interface MetricBarProps {
  label: string
  value: number | string
  trend: string
  accent: string
}

function MetricBar({ label, value, trend, accent }: MetricBarProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between text-sm text-slate-200">
        <p>{label}</p>
        <span>{trend}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`h-2 flex-1 rounded-full ${accent}`} />
        <span className="text-lg font-semibold text-white">{value}</span>
      </div>
    </div>
  )
}
