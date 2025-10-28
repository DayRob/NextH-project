"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Edit, Repeat, Tag, Trash2 } from "lucide-react"
import type { Activity } from "../types"

interface ActivityCardProps {
  activity: Activity
  onEdit: (activity: Activity) => void
  onDelete: (activityId: string) => void
}

const tagColors = {
  Health: "bg-gradient-to-r from-green-500 to-emerald-500",
  Sport: "bg-gradient-to-r from-blue-500 to-cyan-500",
  Study: "bg-gradient-to-r from-purple-500 to-violet-500",
  Mindfulness: "bg-gradient-to-r from-pink-500 to-rose-500",
  Learning: "bg-gradient-to-r from-orange-500 to-amber-500",
  Nutrition: "bg-gradient-to-r from-lime-500 to-green-500",
  Social: "bg-gradient-to-r from-indigo-500 to-purple-500",
  Creative: "bg-gradient-to-r from-fuchsia-500 to-pink-500",
  Work: "bg-gradient-to-r from-slate-500 to-gray-500",
  Personal: "bg-gradient-to-r from-teal-500 to-cyan-500",
}

export function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with Actions */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
              {activity.description && <p className="text-gray-400 text-sm leading-relaxed">{activity.description}</p>}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(activity)}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(activity.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Time and Repeat Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-cyan-400">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{formatTime(activity.time)}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Repeat className="h-4 w-4" />
              <span className="font-medium">{activity.repeatPattern}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-gray-400" />
            {activity.tags.map((tag) => (
              <Badge
                key={tag}
                className={`${
                  tagColors[tag as keyof typeof tagColors] || "bg-gradient-to-r from-gray-500 to-gray-600"
                } text-white border-0 font-medium px-3 py-1 text-xs shadow-lg`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Completion Date */}
          <div className="pt-2 border-t border-gray-700/50">
            <p className="text-xs text-gray-500">Completed on {new Date(activity.completedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
