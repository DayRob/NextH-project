"use client"

import { useMemo, useState } from "react"
import { FlagTriangleRight } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { ChallengeCard } from "@/components/challenge-card"
import { StatsOverview } from "@/components/stats-overview"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Challenge } from "@/types"

const filters: Array<Challenge["status"] | "all"> = ["all", "active", "completed", "paused"]

export default function ChallengesPage() {
  const challenges: Challenge[] = []
  const [statusFilter, setStatusFilter] = useState<(typeof filters)[number]>("all")
  const filtered = useMemo(
    () => (statusFilter === "all" ? challenges : challenges.filter((challenge) => challenge.status === statusFilter)),
    [statusFilter, challenges],
  )

  return (
    <div className="space-y-10">
      <PageHeader
        title="Objectifs & challenges"
        description="Accélérez vos transformations avec des défis guidés et mesurables."
        action={
          <div className="flex gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={statusFilter === filter ? "default" : "outline"}
                className={`rounded-2xl ${statusFilter === filter ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" : "text-white"}`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter === "all" ? "Tous" : filter}
              </Button>
            ))}
          </div>
        }
      />

      <StatsOverview challenges={challenges} />

      <section className="grid gap-6 lg:grid-cols-3">
        {filtered.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} onViewDetails={() => {}} />
        ))}
        {filtered.length === 0 && (
          <Card className="lg:col-span-3 border border-dashed border-white/20 bg-slate-950/40 text-center text-white">
            <CardContent className="flex flex-col items-center gap-4 p-10">
              <FlagTriangleRight className="h-10 w-10 text-cyan-300" />
              <p className="text-lg font-semibold">Aucun challenge pour ce statut</p>
              <p className="text-sm text-slate-300">Changez de filtre pour afficher les autres programmes.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}

