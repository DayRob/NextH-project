"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Calendar, Target, TrendingUp } from "lucide-react"
import type { Challenge } from "../types"

interface StatsOverviewProps {
  challenges: Challenge[]
}

export function StatsOverview({ challenges }: StatsOverviewProps) {
  const activeChallenges = challenges.filter((c) => c.status === "active").length
  const completedChallenges = challenges.filter((c) => c.status === "completed").length
  const totalProgress = challenges.reduce((sum, c) => sum + (c.progress / c.target) * 100, 0)
  const averageProgress = challenges.length > 0 ? Math.round(totalProgress / challenges.length) : 0

  const stats = [
    {
      title: "Active Challenges",
      value: activeChallenges,
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Completed",
      value: completedChallenges,
      icon: Award,
      color: "text-blue-600",
    },
    {
      title: "Average Progress",
      value: `${averageProgress}%`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Days Active",
      value: "12",
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
