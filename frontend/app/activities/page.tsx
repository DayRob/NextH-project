"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarCheck, Filter, Flame, Plus, Sparkles } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { ActivityCard } from "@/components/activity-card"
import { AddActivityForm } from "@/components/add-activity-form"
import { CalendarSection } from "@/components/calendar-section"
import { EditActivityModal } from "@/components/edit-activity-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Activity, ActivityFormData, RepeatFrequency } from "@/types"
import { useProfileId } from "@/hooks/use-profile-id"

const repeatLabels: Record<RepeatFrequency, string> = {
  daily: "Quotidien",
  weekdays: "Jours ouvrés",
  weekends: "Week-ends",
  weekly: "Hebdo",
  custom: "Personnalisé",
}

export default function ActivitiesPage() {
  const { profileId, ready } = useProfileId()
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const filteredActivities = selectedDate ? activities.filter((activity) => activity.date === selectedDate) : activities

  const stats = useMemo(() => {
    const total = activities.length
    const today = new Date().toISOString().split("T")[0]
    const todayCount = activities.filter((activity) => activity.date === today).length
    const mindful = activities.filter((activity) => activity.tags.some((tag) => ["Meditation", "Reading"].includes(tag))).length
    return [
      { label: "Activités totales", value: total, helper: "+4 cette semaine" },
      { label: "Aujourd'hui", value: todayCount, helper: "fiches complétées" },
      { label: "Moments mindful", value: mindful, helper: "lecture & méditation" },
    ]
  }, [activities])

  const handleAddActivity = (data: ActivityFormData) => {
    const date = selectedDate ?? new Date().toISOString().split("T")[0]
    const repeatPattern = buildRepeatPattern(data)
    const newActivity: Activity = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      title: data.title,
      description: data.description,
      time: data.time,
      duration: 45,
      repeatPattern,
      tags: data.tags.length ? data.tags : ["Personal"],
      completedAt: new Date(`${date}T${data.time || "07:00"}:00`).toISOString(),
      category: data.tags[0] || "Routine",
      date,
      intensity: "moderate",
    }
    setActivities((prev) => [newActivity, ...prev])
    setShowAddForm(false)
  }

  const handleUpdateActivity = (activityId: string, data: ActivityFormData) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              title: data.title,
              description: data.description,
              time: data.time,
              repeatPattern: buildRepeatPattern(data),
              tags: data.tags.length ? data.tags : activity.tags,
            }
          : activity,
      ),
    )
    setEditingActivity(null)
  }

  const handleDeleteActivity = (activityId: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
  }

  const uniqueTags = Array.from(new Set(activities.flatMap((activity) => activity.tags)))

  if (!ready) {
    return <p className="text-center text-white">Chargement du module activités...</p>
  }

  if (!profileId) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-10 text-center text-white">
        <p className="text-2xl font-semibold mb-2">Aucun profil détecté</p>
        <p className="text-sm text-slate-300 mb-4">Créez d’abord votre profil pour débloquer le suivi des activités.</p>
        <Button asChild className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <Link href="/onboarding">Créer mon profil</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Activités & rituels"
        description="Suivez vos séances, filtrez par date et enrichissez vos routines bien-être."
        action={
          <Button
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une activité
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{stat.label}</p>
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="text-xs text-slate-300">{stat.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            <CalendarCheck className="h-4 w-4 text-cyan-300" />
            {selectedDate ? (
              <>
                <span className="font-semibold">{selectedDate}</span>
                <Button variant="ghost" size="sm" className="text-slate-300" onClick={() => setSelectedDate(null)}>
                  Effacer le filtre
                </Button>
              </>
            ) : (
              <span>Affiche toutes les activités planifiées</span>
            )}
          </div>

          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => setEditingActivity(activity)}
                onDelete={handleDeleteActivity}
              />
            ))}
            {filteredActivities.length === 0 && (
              <Card className="border border-dashed border-white/20 bg-slate-950/40 text-white">
                <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
                  <Sparkles className="h-8 w-8 text-cyan-300" />
                  <div>
                    <p className="text-lg font-semibold">Aucune activité pour cette période</p>
                    <p className="text-sm text-slate-400">Ajoutez un rituel ou sélectionnez une autre date dans le calendrier.</p>
                  </div>
                  <Button variant="outline" className="rounded-2xl border-white/20 text-white" onClick={() => setShowAddForm(true)}>
                    Planifier une activité
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <CalendarSection activities={activities} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          <Card className="border border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Tags actifs</p>
                  <p className="text-2xl font-semibold">{uniqueTags.length}</p>
                </div>
                <Filter className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 text-white">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-sm text-cyan-100">
                <Flame className="h-4 w-4" />
                Routine la plus constante
              </div>
              {activities.length > 0 ? (
                <>
                  <p className="text-lg font-semibold">
                    {
                      activities.reduce(
                        (acc, curr) => (curr.repeatPattern.length > acc.repeatPattern.length ? curr : acc),
                        activities[0],
                      )?.title
                    }
                  </p>
                  <p className="text-sm text-cyan-50/80">
                    {repeatLabels.daily} • {activities[0].time}
                  </p>
                </>
              ) : (
                <p className="text-sm text-cyan-50/80">Ajoutez vos premières activités pour révéler cette section.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {showAddForm && <AddActivityForm onSubmit={handleAddActivity} onCancel={() => setShowAddForm(false)} />}
      {editingActivity && (
        <EditActivityModal activity={editingActivity} onSubmit={handleUpdateActivity} onCancel={() => setEditingActivity(null)} />
      )}
    </div>
  )
}

function buildRepeatPattern(formData: ActivityFormData) {
  switch (formData.repeatFrequency) {
    case "daily":
      return "Quotidien"
    case "weekdays":
      return "Jours ouvrés"
    case "weekends":
      return "Week-ends"
    case "weekly":
      return "Hebdomadaire"
    case "custom":
      return formData.customDays.length > 0 ? `Chaque ${formData.customDays.join(", ")}` : "Plan personnalisé"
    default:
      return "Quotidien"
  }
}

