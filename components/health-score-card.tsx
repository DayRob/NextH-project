"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, TrendingDown, TrendingUp, Zap } from "lucide-react"
import type { HealthScore } from "../types"

interface HealthScoreCardProps {
  score: HealthScore
}

export function HealthScoreCard({ score }: HealthScoreCardProps) {
  const getStatusIcon = () => {
    switch (score.status) {
      case "excellent":
        return <Award className="h-6 w-6 text-yellow-400" />
      case "good":
        return <TrendingUp className="h-6 w-6 text-green-400" />
      case "fair":
        return <Zap className="h-6 w-6 text-blue-400" />
      case "needs_improvement":
        return <TrendingDown className="h-6 w-6 text-red-400" />
    }
  }

  const getStatusColor = () => {
    switch (score.status) {
      case "excellent":
        return "from-yellow-500 to-orange-500"
      case "good":
        return "from-green-500 to-emerald-500"
      case "fair":
        return "from-blue-500 to-cyan-500"
      case "needs_improvement":
        return "from-red-500 to-pink-500"
    }
  }

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-blue-400"
    if (value >= 40) return "text-yellow-400"
    return "text-red-400"
  }

  const scoreCategories = [
    { label: "Exercise", value: score.exercise },
    { label: "Sleep", value: score.sleep },
    { label: "Mental", value: score.mental },
    { label: "Lifestyle", value: score.lifestyle },
  ]

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          {getStatusIcon()}
          Weekly Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${getStatusColor()} p-1`}>
              <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{score.overall}</div>
                  <div className="text-xs text-gray-400">/ 100</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white capitalize">{score.status.replace("_", " ")}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{score.message}</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">Category Breakdown</h4>
          {scoreCategories.map((category) => (
            <div key={category.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{category.label}</span>
                <span className={`text-sm font-medium ${getScoreColor(category.value)}`}>{category.value}/100</span>
              </div>
              <Progress value={category.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
