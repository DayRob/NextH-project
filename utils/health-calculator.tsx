import type {
  Activity,
  ActivityDistribution,
  HealthMetrics,
  HealthRecommendation,
  HealthScore,
  UserProfile,
} from "../types"

const tagColors = {
  Sport: "#3b82f6",
  Sleep: "#8b5cf6",
  Reading: "#f59e0b",
  Meditation: "#ec4899",
  Walking: "#10b981",
  Nutrition: "#06b6d4",
  Work: "#6b7280",
  Social: "#f97316",
  Creative: "#a855f7",
  Outdoor: "#22c55e",
}

export function calculateActivityDistribution(activities: Activity[]): ActivityDistribution[] {
  const tagStats = activities.reduce(
    (acc, activity) => {
      activity.tags.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = { count: 0, minutes: 0 }
        }
        acc[tag].count += 1
        acc[tag].minutes += activity.duration
      })
      return acc
    },
    {} as Record<string, { count: number; minutes: number }>,
  )

  const totalMinutes = Object.values(tagStats).reduce((sum, stat) => sum + stat.minutes, 0)

  return Object.entries(tagStats).map(([tag, stats]) => ({
    tag,
    count: stats.count,
    minutes: stats.minutes,
    percentage: (stats.minutes / totalMinutes) * 100,
    color: tagColors[tag as keyof typeof tagColors] || "#6b7280",
  }))
}

export function calculateHealthMetrics(activities: Activity[]): HealthMetrics {
  const weeklyActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return activityDate >= weekAgo
  })

  const exerciseActivities = weeklyActivities.filter((activity) =>
    activity.tags.some((tag) => ["Sport", "Walking", "Outdoor"].includes(tag)),
  )

  const sleepActivities = weeklyActivities.filter((activity) => activity.tags.includes("Sleep"))

  const readingActivities = weeklyActivities.filter((activity) => activity.tags.includes("Reading"))

  const meditationActivities = weeklyActivities.filter((activity) => activity.tags.includes("Meditation"))

  const outdoorActivities = weeklyActivities.filter((activity) => activity.tags.includes("Outdoor"))

  return {
    weeklyExerciseMinutes: exerciseActivities.reduce((sum, activity) => sum + activity.duration, 0),
    weeklySteps: exerciseActivities.length * 5000, // Estimated
    averageSleepHours: sleepActivities.reduce((sum, activity) => sum + activity.duration, 0) / 60 / 7,
    weeklyReadingHours: readingActivities.reduce((sum, activity) => sum + activity.duration, 0) / 60,
    weeklyMeditationMinutes: meditationActivities.reduce((sum, activity) => sum + activity.duration, 0),
    weeklyOutdoorMinutes: outdoorActivities.reduce((sum, activity) => sum + activity.duration, 0),
  }
}

export function generateHealthRecommendations(metrics: HealthMetrics, profile: UserProfile): HealthRecommendation[] {
  const recommendations: HealthRecommendation[] = []

  // Exercise recommendations based on WHO guidelines
  const recommendedExercise = 150 // minutes per week
  const exerciseStatus =
    metrics.weeklyExerciseMinutes >= recommendedExercise
      ? "excellent"
      : metrics.weeklyExerciseMinutes >= recommendedExercise * 0.75
        ? "good"
        : metrics.weeklyExerciseMinutes >= recommendedExercise * 0.5
          ? "fair"
          : "poor"

  recommendations.push({
    category: "Physical Activity",
    current: `${metrics.weeklyExerciseMinutes} min/week`,
    recommended: `${recommendedExercise} min/week`,
    status: exerciseStatus,
    message:
      exerciseStatus === "excellent"
        ? "Great job! You're meeting WHO recommendations for physical activity."
        : exerciseStatus === "good"
          ? "You're close to the recommended amount. Try to add a few more minutes of activity."
          : "Consider increasing your physical activity to meet WHO guidelines of 150 minutes per week.",
  })

  // Sleep recommendations
  const recommendedSleep = profile.age < 65 ? 8 : 7 // hours per night
  const sleepStatus =
    metrics.averageSleepHours >= recommendedSleep
      ? "excellent"
      : metrics.averageSleepHours >= recommendedSleep * 0.9
        ? "good"
        : metrics.averageSleepHours >= recommendedSleep * 0.75
          ? "fair"
          : "poor"

  recommendations.push({
    category: "Sleep Quality",
    current: `${metrics.averageSleepHours.toFixed(1)} hrs/night`,
    recommended: `${recommendedSleep} hrs/night`,
    status: sleepStatus,
    message:
      sleepStatus === "excellent"
        ? "Excellent sleep habits! You're getting adequate rest for optimal health."
        : sleepStatus === "good"
          ? "Good sleep duration. Consider maintaining consistent sleep schedules."
          : "Aim for more consistent, quality sleep to support your health goals.",
  })

  // Mental wellness (meditation/reading)
  const mentalMinutes = metrics.weeklyMeditationMinutes + metrics.weeklyReadingHours * 60
  const recommendedMental = 210 // 30 minutes per day
  const mentalStatus =
    mentalMinutes >= recommendedMental
      ? "excellent"
      : mentalMinutes >= recommendedMental * 0.7
        ? "good"
        : mentalMinutes >= recommendedMental * 0.4
          ? "fair"
          : "poor"

  recommendations.push({
    category: "Mental Wellness",
    current: `${Math.round(mentalMinutes)} min/week`,
    recommended: `${recommendedMental} min/week`,
    status: mentalStatus,
    message:
      mentalStatus === "excellent"
        ? "Outstanding mental wellness routine! Keep up the meditation and reading."
        : mentalStatus === "good"
          ? "Good balance of mental wellness activities. Consider adding more mindful practices."
          : "Try to incorporate more meditation, reading, or mindfulness activities into your routine.",
  })

  return recommendations
}

export function calculateHealthScore(metrics: HealthMetrics, profile: UserProfile): HealthScore {
  // Exercise score (0-100)
  const exerciseScore = Math.min(100, (metrics.weeklyExerciseMinutes / 150) * 100)

  // Sleep score (0-100)
  const targetSleep = profile.age < 65 ? 8 : 7
  const sleepScore = Math.min(100, (metrics.averageSleepHours / targetSleep) * 100)

  // Mental wellness score (0-100)
  const mentalMinutes = metrics.weeklyMeditationMinutes + metrics.weeklyReadingHours * 60
  const mentalScore = Math.min(100, (mentalMinutes / 210) * 100)

  // Lifestyle score (outdoor activities, variety)
  const lifestyleScore = Math.min(100, (metrics.weeklyOutdoorMinutes / 120) * 100)

  // Overall score
  const overall = Math.round((exerciseScore + sleepScore + mentalScore + lifestyleScore) / 4)

  let status: HealthScore["status"]
  let message: string

  if (overall >= 80) {
    status = "excellent"
    message = "Outstanding! You're maintaining excellent health habits across all areas."
  } else if (overall >= 65) {
    status = "good"
    message = "Great work! You're on track with most health recommendations."
  } else if (overall >= 45) {
    status = "fair"
    message = "Good foundation! Focus on improving a few key areas for better health."
  } else {
    status = "needs_improvement"
    message = "There's room for improvement. Start with small, consistent changes."
  }

  return {
    overall,
    exercise: Math.round(exerciseScore),
    sleep: Math.round(sleepScore),
    mental: Math.round(mentalScore),
    lifestyle: Math.round(lifestyleScore),
    message,
    status,
  }
}
