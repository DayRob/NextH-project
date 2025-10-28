"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Heart, TrendingUp } from "lucide-react"
import type { HealthRecommendation } from "../types"

interface HealthSummaryProps {
  recommendations: HealthRecommendation[]
}

export function HealthSummary({ recommendations }: HealthSummaryProps) {
  const getStatusIcon = (status: HealthRecommendation["status"]) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "good":
        return <TrendingUp className="h-4 w-4 text-blue-400" />
      case "fair":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "poor":
        return <AlertCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusColor = (status: HealthRecommendation["status"]) => {
    switch (status) {
      case "excellent":
        return "text-green-400"
      case "good":
        return "text-blue-400"
      case "fair":
        return "text-yellow-400"
      case "poor":
        return "text-red-400"
    }
  }

  const getProgressValue = (status: HealthRecommendation["status"]) => {
    switch (status) {
      case "excellent":
        return 100
      case "good":
        return 75
      case "fair":
        return 50
      case "poor":
        return 25
    }
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400" />
          Health Summary
        </CardTitle>
        <p className="text-sm text-gray-400">Based on WHO guidelines and your personal data</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendations.map((rec) => (
          <div key={rec.category} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(rec.status)}
                <h3 className="font-medium text-white">{rec.category}</h3>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(rec.status)}`}>
                {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current: {rec.current}</span>
                <span className="text-gray-400">Target: {rec.recommended}</span>
              </div>
              <Progress value={getProgressValue(rec.status)} className="h-2" />
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{rec.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
