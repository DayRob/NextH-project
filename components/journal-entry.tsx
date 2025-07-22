"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Heart } from "lucide-react"
import type { JournalEntry } from "../types"

interface JournalEntryProps {
  entry: JournalEntry
  challengeTitle: string
}

export function JournalEntryCard({ entry, challengeTitle }: JournalEntryProps) {
  const getMoodColor = (mood: JournalEntry["mood"]) => {
    switch (mood) {
      case "great":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "okay":
        return "bg-yellow-500"
      case "difficult":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMoodEmoji = (mood: JournalEntry["mood"]) => {
    switch (mood) {
      case "great":
        return "😊"
      case "good":
        return "🙂"
      case "okay":
        return "😐"
      case "difficult":
        return "😔"
      default:
        return "😐"
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{challengeTitle}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getMoodColor(entry.mood)}>
              {getMoodEmoji(entry.mood)} {entry.mood}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(entry.date).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-1">Today's Progress</h4>
          <p className="text-sm text-muted-foreground">{entry.content}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
            <Heart className="h-3 w-3" />
            Reflection
          </h4>
          <p className="text-sm text-muted-foreground">{entry.reflection}</p>
        </div>
      </CardContent>
    </Card>
  )
}
