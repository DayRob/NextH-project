"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { ProfileOnboardingForm } from "@/components/profile-onboarding-form"
import { Button } from "@/components/ui/button"

export default function OnboardingPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="text-slate-200 hover:text-white">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Link>
        </Button>
      </div>
      <PageHeader
        title="Démarrer mon suivi"
        description="Renseignez quelques informations personnelles pour générer des recommandations personnalisées."
      />
      <ProfileOnboardingForm />
    </div>
  )
}

