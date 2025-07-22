"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import type { ActivityFormData, RepeatFrequency } from "../types"

interface AddActivityFormProps {
  onSubmit: (data: ActivityFormData) => void
  onCancel: () => void
}

const predefinedTags = [
  "Health",
  "Sport",
  "Focus",
  "Mindfulness",
  "Learning",
  "Nutrition",
  "Social",
  "Creative",
  "Work",
  "Personal",
]

const repeatOptions = [
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays only" },
  { value: "weekends", label: "Weekends only" },
  { value: "weekly", label: "Once a week" },
  { value: "custom", label: "Custom schedule" },
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AddActivityForm({ onSubmit, onCancel }: AddActivityFormProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    title: "",
    description: "",
    time: "",
    tags: [],
    repeatFrequency: "daily",
    customDays: [],
  })

  const [customTag, setCustomTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.time) {
      onSubmit(formData)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim())
      setCustomTag("")
    }
  }

  const toggleCustomDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      customDays: prev.customDays.includes(day) ? prev.customDays.filter((d) => d !== day) : [...prev.customDays, day],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
            Add New Activity
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-medium">
                Activity Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Morning Jog"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the activity..."
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 min-h-[80px]"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white font-medium">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500"
                required
              />
            </div>

            {/* Repeat Frequency */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Repeat Frequency</Label>
              <Select
                value={formData.repeatFrequency}
                onValueChange={(value: RepeatFrequency) => setFormData((prev) => ({ ...prev, repeatFrequency: value }))}
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {repeatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white focus:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Days Selection */}
            {formData.repeatFrequency === "custom" && (
              <div className="space-y-2">
                <Label className="text-white font-medium">Select Days</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.customDays.includes(day) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCustomDay(day)}
                      className={
                        formData.customDays.includes(day)
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Tags</Label>

              {/* Predefined Tags */}
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Add custom tag..."
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                />
                <Button
                  type="button"
                  onClick={addCustomTag}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Add
                </Button>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-medium px-3 py-1"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="ml-2 h-auto p-0 text-white hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-medium"
              >
                Add Activity
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
