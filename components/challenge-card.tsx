"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, TrendingUp } from "lucide-react"
import type { Challenge } from "../types"

interface ChallengeCardProps {
  challenge: Challenge
  onViewDetails: (challenge: Challenge) => void
}

export function ChallengeCard({ challenge, onViewDetails }: ChallengeCardProps) {
  const progressPercentage = (challenge.progress / challenge.target) * 100

  const getStatusColor = (status: Challenge["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "paused":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>
          <Badge variant="secondary" className={getStatusColor(challenge.status)}>
            {challenge.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {challenge.progress} / {challenge.target}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">{Math.round(progressPercentage)}% complete</div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>{challenge.category}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => onViewDetails(challenge)}>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
