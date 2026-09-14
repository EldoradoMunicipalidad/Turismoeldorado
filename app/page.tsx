import type { Metadata } from "next"
import { Fragment } from "react"
import { HomeSiteHeader } from "@/components/home-site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesBar } from "@/components/features-bar"
import { ImperdiblesSection } from "@/components/imperdibles-section"
import { EventsBanner } from "@/components/events-banner"
import { PlanificaSection } from "@/components/planifica-section"
import { ViviEldoradoSection } from "@/components/vivi-eldorado-section"
import { HomeSiteFooter } from "@/components/home-site-footer"
import {
  getHomePageContent,
  readCollection,
} from "@/lib/db"
import { isHomeContentDocument } from "@/lib/home-content"
import type { SearchItem } from "@/components/home-site-header"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const contentRecord = await getHomePageContent()
  const content = isHomeContentDocument(contentRecord?.content) ? contentRecord.content : null
  const image = content?.hero.imageUrl.trim() ?? ""
  return {
    title: { absolute: content?.metadata.title ?? "" },
    description: content?.metadata.description ?? "",
    keywords: content?.metadata.keywords ?? [],
    applicationName: content?.metadata.siteName ?? "",
    alternates: { canonical: "/" },
    openGraph: {
      title: content?.metadata.openGraphTitle ?? "",
      description: content?.metadata.openGraphDescription ?? "",
      siteName: content?.metadata.siteName ?? "",
      url: "/",
      images: image ? [image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: content?.metadata.openGraphTitle ?? "",
      description: content?.metadata.openGraphDescription ?? "",
      images: image ? [image] : [],
    },
  }
}

export default async function Page() {
  const [experiences, events, sportActivities, accommodations, restaurants, contentRecord] = await Promise.all([
    readCollection("experiences"),
    readCollection("events"),
    readCollection("sportActivities"),
    readCollection("accommodations"),
    readCollection("restaurants"),
    getHomePageContent(),
  ])
  const content = isHomeContentDocument(contentRecord?.content) ? contentRecord.content : null

  const searchItems: SearchItem[] = content
    ? [
        ...experiences.map((item) => ({
          title: item.title,
          description: item.description,
          href: `/que-hacer/${item.id}`,
          category: content.header.search.resultCategoryExperiences,
        })),
        ...events.map((item) => ({
          title: item.title,
          description: item.description,
          href: `/eventos/${item.id}`,
          category: content.header.search.resultCategoryEvents,
        })),
        ...accommodations.map((item) => ({
          title: item.name,
          description: item.description,
          href: `/donde-alojarse/${item.id}`,
          category: content.header.search.resultCategoryAccommodations,
        })),
        ...restaurants.map((item) => ({
          title: item.name,
          description: item.description,
          href: `/donde-comer/${item.id}`,
          category: content.header.search.resultCategoryRestaurants,
        })),
        ...sportActivities.map((item) => ({
          title: item.title,
          description: item.description,
          href: `/deportes-eventos/${item.id}`,
          category: content.header.search.resultCategorySports,
        })),
      ]
    : []

  return (
    <main className="min-h-screen bg-background">
      {content && <HomeSiteHeader config={content.header} searchItems={searchItems} />}
      <HeroSection config={content?.hero} eyebrow={content?.heroEyebrow} quickLinks={content?.header.quickLinks} />
      {content?.sectionOrder.map((section) => (
        <Fragment key={section}>
          {section === "features" && <FeaturesBar config={content.features} />}
          {section === "imperdibles" && <ImperdiblesSection config={content.imperdibles} experiences={experiences} sportActivities={sportActivities} />}
          {section === "events" && <EventsBanner config={content.events} events={events} />}
          {section === "planifica" && <PlanificaSection config={content.planifica} />}
          {section === "vivi" && <ViviEldoradoSection config={content.vivi} experiences={experiences} sportActivities={sportActivities} />}
        </Fragment>
      ))}
      {content && <HomeSiteFooter config={content.footer} />}
    </main>
  )
}
