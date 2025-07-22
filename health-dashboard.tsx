"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, BarChart3, Heart, TrendingUp } from "lucide-react"
import { ActivityDistributionChart } from "./components/activity-distribution-chart"
import { HealthScoreCard } from "./components/health-score-card"
import { HealthSummary } from "./components/health-summary"
import { ProfileSettings } from "./components/profile-settings"
import type { Activity as ActivityType, UserProfile } from "./types"
import {
  calculateActivityDistribution,
  calculateHealthMetrics,
  calculateHealthScore,
  generateHealthRecommendations,
} from "./utils/health-calculator"

// Mock data
const mockProfile: UserProfile = {
  id: "1",
  name: "Alex Johnson",
  age: 28,
  weight: 70,
  height: 175,
  healthGoal: "general_health",
  activityLevel: "moderately_active",
}

const mockActivities: ActivityType[] = [
  {
    id: "1",
    title: "Morning Run",
    duration: 45,
    tags: ["Sport", "Outdoor"],
    completedAt: "2024-01-22T07:30:00Z",
    date: "2024-01-22",
    time: "07:30",
    calories: 400,
    intensity: "moderate",
  },
  {
    id: "2",
    title: "Night Sleep",
    duration: 480, // 8 hours
    tags: ["Sleep"],
    completedAt: "2024-01-22T23:00:00Z",
    date: "2024-01-22",
    time: "23:00",
  },
  {
    id: "3",
    title: "Reading Session",
    duration: 60,
    tags: ["Reading"],
    completedAt: "2024-01-22T20:00:00Z",
    date: "2024-01-22",
    time: "20:00",
  },
  {
    id: "4",
    title: "Meditation",
    duration: 20,
    tags: ["Meditation"],
    completedAt: "2024-01-22T06:00:00Z",
    date: "2024-01-22",
    time: "06:00",
  },
  {
    id: "5",
    title: "Evening Walk",
    duration: 30,
    tags: ["Walking", "Outdoor"],
    completedAt: "2024-01-21T18:00:00Z",
    date: "2024-01-21",
    time: "18:00",
  },
  {
    id: "6",
    title: "Gym Workout",
    duration: 60,
    tags: ["Sport"],
    completedAt: "2024-01-21T17:00:00Z",
    date: "2024-01-21",
    time: "17:00",
    calories: 350,
    intensity: "high",
  },
  {
    id: "7",
    title: "Night Sleep",
    duration: 420, // 7 hours
    tags: ["Sleep"],
    completedAt: "2024-01-21T23:30:00Z",
    date: "2024-01-21",
    time: "23:30",
  },
  {
    id: "8",
    title: "Yoga Session",
    duration: 45,
    tags: ["Sport", "Meditation"],
    completedAt: "2024-01-20T08:00:00Z",
    date: "2024-01-20",
    time: "08:00",
  },
]

export default function HealthDashboard() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [activities] = useState<ActivityType[]>(mockActivities)

  const activityDistribution = calculateActivityDistribution(activities)
  const healthMetrics = calculateHealthMetrics(activities)
  const healthRecommendations = generateHealthRecommendations(healthMetrics, profile)
  const healthScore = calculateHealthScore(healthMetrics, profile)

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
  }

  // Calculate some quick stats
  const totalActivities = activities.length
  const weeklyActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return activityDate >= weekAgo
  }).length

  const totalMinutesThisWeek = activities
    .filter((activity) => {
      const activityDate = new Date(activity.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return activityDate >= weekAgo
    })
    .reduce((sum, activity) => sum + activity.duration, 0)

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Health Dashboard
                </h1>
                <p className="text-gray-400">Track your wellness journey with personalized insights</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{weeklyActivities}</p>
                    <p className="text-purple-300 text-sm">Activities This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border-cyan-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{Math.round(totalMinutesThisWeek / 60)}h</p>
                    <p className="text-cyan-300 text-sm">Active Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Heart className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{healthScore.overall}</p>
                    <p className="text-green-300 text-sm">Health Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalActivities}</p>
                    <p className="text-orange-300 text-sm">Total Logged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activity Distribution Chart */}
              <ActivityDistributionChart data={activityDistribution} />

              {/* Health Summary */}
              <HealthSummary recommendations={healthRecommendations} />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Health Score */}
              <HealthScoreCard score={healthScore} />

              {/* Profile Settings */}
              <ProfileSettings profile={profile} onUpdateProfile={handleUpdateProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
