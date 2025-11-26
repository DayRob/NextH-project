"use client"

import type React from "react"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, User } from "lucide-react"
import type { UserProfile } from "../types"
import { updateProfile } from "@/lib/api"

interface ProfileSettingsProps {
  profile: UserProfile
  onUpdateProfile: (profile: UserProfile) => void
}

export function ProfileSettings({ profile, onUpdateProfile }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserProfile>(profile)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData(profile)
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        setError(null)
        const updated = await updateProfile(formData.id, {
          name: formData.name,
          age: formData.age ?? undefined,
          weightKg: formData.weightKg ?? undefined,
          heightCm: formData.heightCm ?? undefined,
          healthGoal: formData.healthGoal,
          activityLevel: formData.activityLevel,
        })
        onUpdateProfile(updated)
        setIsEditing(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de mettre à jour le profil")
      }
    })
  }

  const calculateBMI = () => {
    if (!formData.heightCm || !formData.weightKg) return null
    const heightInM = formData.heightCm / 100
    if (!heightInM) return null
    return (formData.weightKg / (heightInM * heightInM)).toFixed(1)
  }

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-blue-400" }
    if (bmi < 25) return { status: "Normal", color: "text-green-400" }
    if (bmi < 30) return { status: "Overweight", color: "text-yellow-400" }
    return { status: "Obese", color: "text-red-400" }
  }

  const bmiValue = calculateBMI()
  const bmi = bmiValue ? Number.parseFloat(bmiValue) : null
  const bmiStatus = bmi ? getBMIStatus(bmi) : { status: "N/A", color: "text-gray-400" }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" />
            Profile & Settings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      age: e.target.value ? Number.parseInt(e.target.value) : null,
                    }))
                  }
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-white">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weightKg ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weightKg: e.target.value ? Number.parseFloat(e.target.value) : null,
                    }))
                  }
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-white">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.heightCm ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      heightCm: e.target.value ? Number.parseInt(e.target.value) : null,
                    }))
                  }
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Health Goal</Label>
              <Select
                value={formData.healthGoal ?? ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, healthGoal: value as UserProfile["healthGoal"] }))
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="weight_loss" className="text-white">
                    Weight Loss
                  </SelectItem>
                  <SelectItem value="muscle_gain" className="text-white">
                    Muscle Gain
                  </SelectItem>
                  <SelectItem value="maintenance" className="text-white">
                    Maintenance
                  </SelectItem>
                  <SelectItem value="endurance" className="text-white">
                    Endurance
                  </SelectItem>
                  <SelectItem value="general_health" className="text-white">
                    General Health
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Activity Level</Label>
              <Select
                value={formData.activityLevel ?? ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, activityLevel: value as UserProfile["activityLevel"] }))
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="sedentary" className="text-white">
                    Sedentary
                  </SelectItem>
                  <SelectItem value="lightly_active" className="text-white">
                    Lightly Active
                  </SelectItem>
                  <SelectItem value="moderately_active" className="text-white">
                    Moderately Active
                  </SelectItem>
                  <SelectItem value="very_active" className="text-white">
                    Very Active
                  </SelectItem>
                  <SelectItem value="extremely_active" className="text-white">
                    Extremely Active
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isPending ? "Sauvegarde..." : "Save Changes"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-white font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Age</p>
                <p className="text-white font-medium">{profile.age ?? "—"} years</p>
              </div>
              <div>
                <p className="text-gray-400">Weight</p>
                <p className="text-white font-medium">{profile.weightKg ?? "—"} kg</p>
              </div>
              <div>
                <p className="text-gray-400">Height</p>
                <p className="text-white font-medium">{profile.heightCm ?? "—"} cm</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">BMI</p>
                <p className="text-white font-medium">{bmiValue ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Status</p>
                <p className={`font-medium ${bmiStatus.color}`}>{bmi ? bmiStatus.status : "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-gray-400 text-sm">Health Goal</p>
                <p className="text-white font-medium capitalize">
                  {profile.healthGoal ? profile.healthGoal.replace("_", " ") : "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Activity Level</p>
                <p className="text-white font-medium capitalize">
                  {profile.activityLevel ? profile.activityLevel.replace("_", " ") : "—"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
