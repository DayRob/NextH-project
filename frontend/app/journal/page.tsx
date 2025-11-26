"use client"

import { useMemo } from "react"
import { NotebookPen, Smile } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { JournalEntryCard } from "@/components/journal-entry"
import { Card, CardContent } from "@/components/ui/card"
import type { JournalEntry } from "@/types"
import { useProfileId } from "@/hooks/use-profile-id"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JournalPage() {
  const entries: JournalEntry[] = []
  const { profileId, ready } = useProfileId()
  const moodStats = useMemo(() => {
    const counts = entries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts).map(([mood, count]) => ({ mood, count }))
  }, [entries])

  if (!ready) {
    return <p className="text-center text-white">Chargement du journal...</p>
  }

  if (!profileId) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-10 text-center text-white">
        <NotebookPen className="mx-auto mb-4 h-10 w-10 text-cyan-300" />
        <p className="text-2xl font-semibold mb-2">Activez votre profil pour accéder au journal</p>
        <p className="text-sm text-slate-300 mb-4">Créez un profil pour débloquer le suivi des notes quotidiennes.</p>
        <Button asChild className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <Link href="/onboarding">Créer mon profil</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Journal guidé"
        description="Capturez vos sensations, votre énergie et les apprentissages liés à vos rituels."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {moodStats.map((stat) => (
          <Card key={stat.mood} className="border border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{stat.mood}</p>
              <p className="text-3xl font-semibold">{stat.count}</p>
              <p className="text-xs text-slate-300">entrées associées</p>
            </CardContent>
          </Card>
        ))}
        <Card className="border border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white">
          <CardContent className="flex items-center gap-4 p-5">
            <Smile className="h-8 w-8 text-pink-200" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-100">Astuce</p>
              <p className="text-sm text-pink-50/80">Ajoutez un mot-clé à chaque entrée pour retrouver vos thématiques.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {entries.length === 0 ? (
        <Card className="border border-dashed border-white/20 bg-slate-950/40 text-center text-white">
          <CardContent className="flex flex-col items-center gap-4 p-10">
            <NotebookPen className="h-10 w-10 text-cyan-300" />
            <p className="text-lg font-semibold">Aucune entrée pour l’instant</p>
            <p className="text-sm text-slate-300">Vos notes s’afficheront ici dès que vous aurez journalisé une journée.</p>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} challengeTitle="Programme personnalisé" />
          ))}
        </section>
      )}
    </div>
  )
}

