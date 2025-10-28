"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Plus, Target } from "lucide-react"
import { ActivityCard } from "./components/activity-card"
import { CalendarSection } from "./components/calendar-section"
import { EditActivityModal } from "./components/edit-activity-modal"
import type { Activity, ActivityFormData } from "./types"

// Mock data with dates
const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Morning Jog",
    description: "30-minute jog around the neighborhood to start the day with energy",
    time: "07:30",
    repeatPattern: "Every Monday, Wednesday, Friday",
    tags: ["Health", "Sport"],
    completedAt: "2024-01-22T07:30:00Z",
    category: "Exercise",
    date: "2024-01-22",
  },
  {
    id: "2",
    title: "Meditation Session",
    description: "10 minutes of mindfulness meditation using breathing techniques",
    time: "06:00",
    repeatPattern: "Daily",
    tags: ["Mindfulness", "Health"],
    completedAt: "2024-01-22T06:00:00Z",
    category: "Mental Health",
    date: "2024-01-22",
  },
  {
    id: "3",
    title: "Study Session",
    description: "Review JavaScript concepts and practice coding exercises",
    time: "19:00",
    repeatPattern: "Weekdays",
    tags: ["Study", "Learning"],
    completedAt: "2024-01-21T19:00:00Z",
    category: "Education",
    date: "2024-01-21",
  },
  {
    id: "4",
    title: "Healthy Breakfast",
    description: "Prepare and eat a nutritious breakfast with fruits and whole grains",
    time: "08:00",
    repeatPattern: "Daily",
    tags: ["Health", "Nutrition"],
    completedAt: "2024-01-22T08:00:00Z",
    category: "Nutrition",
    date: "2024-01-22",
  },
  {
    id: "5",
    title: "Evening Reading",
    description: "Read for 30 minutes before bed to wind down and learn something new",
    time: "21:00",
    repeatPattern: "Daily",
    tags: ["Learning", "Personal"],
    completedAt: "2024-01-21T21:00:00Z",
    category: "Education",
    date: "2024-01-21",
  },
  {
    id: "6",
    title: "Yoga Practice",
    description: "20-minute yoga session for flexibility and mindfulness",
    time: "18:00",
    repeatPattern: "Every Tuesday, Thursday",
    tags: ["Health", "Mindfulness"],
    completedAt: "2024-01-23T18:00:00Z",
    category: "Exercise",
    date: "2024-01-23",
  },
]

export default function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const filteredActivities = selectedDate ? activities.filter((activity) => activity.date === selectedDate) : activities

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity)
  }

  const handleUpdateActivity = (activityId: string, formData: ActivityFormData) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            title: formData.title,
            description: formData.description,
            time: formData.time,
            tags: formData.tags,
            repeatPattern: getRepeatPattern(formData),
          }
        }
        return activity
      }),
    )
    setEditingActivity(null)
  }

  const handleDeleteActivity = (activityId: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
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

  const getSelectedDateString = () => {
    if (!selectedDate) return ""
    const date = new Date(selectedDate)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Personal Improvement Dashboard
                  </h1>
                  <p className="text-gray-400">Track your daily progress and build better habits</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-medium px-6 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="lg:col-span-1">
              <CalendarSection activities={activities} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>

            {/* Challenge Log Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-700/50">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-cyan-400" />
                    My Challenge Log
                    {selectedDate && (
                      <span className="text-sm font-normal text-gray-400 ml-2">- {getSelectedDateString()}</span>
                    )}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400">
                      {selectedDate
                        ? `${filteredActivities.length} activities on selected date`
                        : `${activities.length} total activities logged`}
                    </p>
                    {selectedDate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(null)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        Show All Activities
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {filteredActivities.length > 0 ? (
                    <div className="space-y-4">
                      {filteredActivities
                        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                        .map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onEdit={handleEditActivity}
                            onDelete={handleDeleteActivity}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800/50 rounded-full w-fit mx-auto">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {selectedDate ? "No activities on this date" : "No activities yet"}
                          </h3>
                          <p className="text-gray-400 mb-6">
                            {selectedDate
                              ? "Try selecting a different date or add a new activity."
                              : "Start tracking your progress by adding your first activity."}
                          </p>
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-medium">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Activity
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Edit Activity Modal */}
        {editingActivity && (
          <EditActivityModal
            activity={editingActivity}
            onSubmit={handleUpdateActivity}
            onCancel={() => setEditingActivity(null)}
          />
        )}
      </div>
    </div>
  )
}
