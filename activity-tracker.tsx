"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Plus, Target, TrendingUp } from "lucide-react"
import { ActivityCard } from "./components/activity-card"
import { AddActivityForm } from "./components/add-activity-form"
import type { Activity, ActivityFormData, Challenge } from "./types"

// Mock data
const mockChallenge: Challenge = {
  id: "1",
  name: "30-Day Wellness Challenge",
  description: "Transform your daily routine with healthy habits",
  activities: [
    {
      id: "1",
      title: "Morning Jog",
      description: "30-minute jog around the neighborhood to start the day with energy",
      time: "07:30",
      repeatPattern: "Every Monday, Wednesday, Friday",
      tags: ["Health", "Sport"],
      completedAt: "2024-01-22T07:30:00Z",
      category: "Exercise",
    },
    {
      id: "2",
      title: "Meditation Session",
      description: "10 minutes of mindfulness meditation using breathing techniques",
      time: "06:00",
      repeatPattern: "Daily",
      tags: ["Mindfulness", "Focus"],
      completedAt: "2024-01-22T06:00:00Z",
      category: "Mental Health",
    },
    {
      id: "3",
      title: "Healthy Breakfast",
      description: "Prepare and eat a nutritious breakfast with fruits and whole grains",
      time: "08:00",
      repeatPattern: "Daily",
      tags: ["Health", "Nutrition"],
      completedAt: "2024-01-22T08:00:00Z",
      category: "Nutrition",
    },
    {
      id: "4",
      title: "Evening Reading",
      description: "Read for 30 minutes before bed to wind down and learn something new",
      time: "21:00",
      repeatPattern: "Daily",
      tags: ["Learning", "Personal"],
      completedAt: "2024-01-21T21:00:00Z",
      category: "Education",
    },
    {
      id: "5",
      title: "Team Standup",
      description: "Daily team synchronization meeting to align on priorities",
      time: "09:00",
      repeatPattern: "Weekdays",
      tags: ["Work", "Social"],
      completedAt: "2024-01-22T09:00:00Z",
      category: "Work",
    },
  ],
}

export default function ActivityTracker() {
  const [challenge, setChallenge] = useState<Challenge>(mockChallenge)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddActivity = (formData: ActivityFormData) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      time: formData.time,
      repeatPattern: getRepeatPattern(formData),
      tags: formData.tags,
      completedAt: new Date().toISOString(),
      category: formData.tags[0] || "General",
    }

    setChallenge((prev) => ({
      ...prev,
      activities: [newActivity, ...prev.activities],
    }))
    setShowAddForm(false)
  }

  const getRepeatPattern = (formData: ActivityFormData): string => {
    switch (formData.repeatFrequency) {
      case "daily":
        return "Daily"
      case "weekdays":
        return "Weekdays"
      case "weekends":
        return "Weekends"
      case "weekly":
        return "Weekly"
      case "custom":
        return formData.customDays.length > 0 ? `Every ${formData.customDays.join(", ")}` : "Custom schedule"
      default:
        return "Daily"
    }
  }

  const todayActivities = challenge.activities.filter((activity) => {
    const activityDate = new Date(activity.completedAt).toDateString()
    const today = new Date().toDateString()
    return activityDate === today
  })

  const totalActivities = challenge.activities.length
  const completedToday = todayActivities.length

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {challenge.name}
                  </h1>
                </div>
                <p className="text-gray-400 text-lg">{challenge.description}</p>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-medium px-6 py-3 text-lg shadow-lg shadow-purple-500/25"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{completedToday}</p>
                    <p className="text-purple-300 text-sm">Completed Today</p>
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
                    <p className="text-2xl font-bold text-white">{totalActivities}</p>
                    <p className="text-cyan-300 text-sm">Total Activities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border-pink-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/20 rounded-lg">
                    <Target className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {totalActivities > 0 ? Math.round((completedToday / totalActivities) * 100) : 0}%
                    </p>
                    <p className="text-pink-300 text-sm">Daily Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Recent Activities</h2>
              <p className="text-gray-400">{challenge.activities.length} activities logged</p>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {challenge.activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {challenge.activities.length === 0 && (
              <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-full w-fit mx-auto">
                      <Target className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">No activities yet</h3>
                      <p className="text-gray-400 mb-6">Start tracking your progress by adding your first activity.</p>
                      <Button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Activity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Add Activity Form Modal */}
        {showAddForm && <AddActivityForm onSubmit={handleAddActivity} onCancel={() => setShowAddForm(false)} />}
      </div>
    </div>
  )
}
