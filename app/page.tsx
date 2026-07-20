import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesBar } from "@/components/features-bar"
import { QueHacerSection } from "@/components/que-hacer-section"
import { ImperdiblesSection } from "@/components/imperdibles-section"
import { EventsBanner } from "@/components/events-banner"
import { PlanificaSection } from "@/components/planifica-section"
import { ViviEldoradoSection } from "@/components/vivi-eldorado-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />
      <FeaturesBar />
      <QueHacerSection />
      <ImperdiblesSection />
      <EventsBanner />
      <PlanificaSection />
      <ViviEldoradoSection />
      <SiteFooter />
    </main>
  )
}
