export interface UserProfile {
  id: string
  name: string
  age: number
  weight: number // in kg
  height: number // in cm
  healthGoal: "weight_loss" | "muscle_gain" | "maintenance" | "endurance" | "general_health"
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active"
}

export interface Activity {
  id: string
  title: string
  description?: string
  time: string
  repeatPattern: string
  tags: string[]
  completedAt: string
  category: string
  date: string
}

export interface ActivityFormData {
  title: string
  description: string
  time: string
  tags: string[]
  repeatFrequency: RepeatFrequency
  customDays: string[]
}

export type RepeatFrequency = "daily" | "weekdays" | "weekends" | "weekly" | "custom"

export interface Challenge {
  id: string
  name: string
  description: string
  activities: Activity[]
  progress: number
  target: number
  startDate: string
  status: "active" | "completed" | "paused"
  category: string
}

export interface JournalEntry {
  id: string
  date: string
  mood: "great" | "good" | "okay" | "difficult"
  content: string
  reflection: string
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  hasActivities: boolean
  activityCount: number
}

export interface HealthMetrics {
  weeklyExerciseMinutes: number
  weeklySteps: number
  averageSleepHours: number
  weeklyReadingHours: number
  weeklyMeditationMinutes: number
  weeklyOutdoorMinutes: number
}

export interface HealthScore {
  overall: number
  exercise: number
  sleep: number
  mental: number
  lifestyle: number
  message: string
  status: "excellent" | "good" | "fair" | "needs_improvement"
}

export interface ActivityDistribution {
  tag: string
  count: number
  minutes: number
  percentage: number
  color: string
}

export interface HealthRecommendation {
  category: string
  current: string
  recommended: string
  status: "excellent" | "good" | "fair" | "poor"
  message: string
}
