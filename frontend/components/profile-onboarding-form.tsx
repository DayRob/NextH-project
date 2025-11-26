"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserProfile } from "@/types"
import { createProfile } from "@/lib/api"

const goals: Array<UserProfile["healthGoal"]> = ["general_health", "weight_loss", "muscle_gain", "endurance", "maintenance"]
const activityLevels: Array<UserProfile["activityLevel"]> = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
  "extremely_active",
]

export function ProfileOnboardingForm() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    age: "",
    weightKg: "",
    heightCm: "",
    healthGoal: "general_health" as UserProfile["healthGoal"],
    activityLevel: "moderately_active" as UserProfile["activityLevel"],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const profile = await createProfile({
        name: formState.name,
        email: formState.email,
        age: formState.age ? Number(formState.age) : undefined,
        weightKg: formState.weightKg ? Number(formState.weightKg) : undefined,
        heightCm: formState.heightCm ? Number(formState.heightCm) : undefined,
        healthGoal: formState.healthGoal,
        activityLevel: formState.activityLevel,
      })
      if (typeof window !== "undefined") {
        window.localStorage.setItem("profileId", profile.id)
      }
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer le profil")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-white/10 bg-slate-950/60 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Créer mon profil bien-être</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Nom complet"
              required
              value={formState.name}
              onChange={(value) => setFormState((prev) => ({ ...prev, name: value }))}
            />
            <FormField
              label="Email"
              type="email"
              required
              value={formState.email}
              onChange={(value) => setFormState((prev) => ({ ...prev, email: value }))}
            />
            <FormField
              label="Âge"
              type="number"
              value={formState.age}
              onChange={(value) => setFormState((prev) => ({ ...prev, age: value }))}
            />
            <FormField
              label="Poids (kg)"
              type="number"
              value={formState.weightKg}
              onChange={(value) => setFormState((prev) => ({ ...prev, weightKg: value }))}
            />
            <FormField
              label="Taille (cm)"
              type="number"
              value={formState.heightCm}
              onChange={(value) => setFormState((prev) => ({ ...prev, heightCm: value }))}
            />
            <div className="space-y-2">
              <Label>Objectif santé</Label>
              <Select
                value={formState.healthGoal}
                onValueChange={(value: UserProfile["healthGoal"]) => setFormState((prev) => ({ ...prev, healthGoal: value }))}
              >
                <SelectTrigger className="bg-white/5 text-white">
                  <SelectValue aria-label="Objectif santé sélectionné" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white">
                  {goals.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau d'activité</Label>
              <Select
                value={formState.activityLevel}
                onValueChange={(value: UserProfile["activityLevel"]) =>
                  setFormState((prev) => ({ ...prev, activityLevel: value }))
                }
              >
                <SelectTrigger className="bg-white/5 text-white">
                  <SelectValue aria-label="Niveau d'activité sélectionné" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white">
                  {activityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          >
            {isSubmitting ? "Création en cours..." : "Enregistrer mon profil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

type FormFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
}

function FormField({ label, value, onChange, required, type = "text" }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-white/5 text-white"
      />
    </div>
  )
}

