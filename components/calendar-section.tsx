"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import type { Activity, CalendarDay } from "../types"

interface CalendarSectionProps {
  activities: Activity[]
  selectedDate: string | null
  onDateSelect: (date: string | null) => void
}

export function CalendarSection({ activities, selectedDate, onDateSelect }: CalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const openNativeCalendar = () => {
    // For iOS devices, try to open the native Calendar app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    if (isIOS) {
      // Try different calendar URL schemes
      const calendarUrls = [
        "calshow://", // iOS Calendar app
        "x-apple-calendar://", // Alternative iOS Calendar scheme
        "webcal://calendar.google.com/calendar/ical/primary/public/basic.ics", // Fallback to web calendar
      ]

      // Try to open the first available scheme
      for (const url of calendarUrls) {
        try {
          window.location.href = url
          break
        } catch (error) {
          console.log(`Failed to open ${url}:`, error)
        }
      }
    } else {
      // For other devices, open Google Calendar
      window.open("https://calendar.google.com/calendar/", "_blank")
    }
  }

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: CalendarDay[] = []
    const today = new Date()

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dateString = date.toISOString().split("T")[0]
      const dayActivities = activities.filter((activity) => activity.date === dateString)

      days.push({
        date: dateString,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        hasActivities: dayActivities.length > 0,
        activityCount: dayActivities.length,
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const calendarDays = generateCalendarDays()

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={openNativeCalendar}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent w-fit"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Calendar
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => (
            <button
              key={day.date}
              onClick={() => onDateSelect(selectedDate === day.date ? null : day.date)}
              className={`
                relative aspect-square p-1 text-sm rounded-lg transition-all duration-200
                ${!day.isCurrentMonth ? "text-gray-600" : "text-gray-300"}
                ${day.isToday ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold" : ""}
                ${selectedDate === day.date ? "ring-2 ring-cyan-400 bg-cyan-500/20" : ""}
                ${day.hasActivities && !day.isToday ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30" : ""}
                hover:bg-gray-700/50
              `}
            >
              <span className="relative z-10">{day.day}</span>
              {day.hasActivities && (
                <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
              )}
              {day.activityCount > 1 && (
                <div className="absolute top-0.5 right-0.5 text-xs bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {day.activityCount}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500/20 border border-purple-500/30 rounded"></div>
              <span>Has Activities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 ring-2 ring-cyan-400 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
