export type HomeLink = { label: string; href: string; icon?: string }

export type HomeCollectionItem = {
  source: "experience" | "sportActivity"
  sourceId: string
  title?: string
  description?: string
  image?: string
  href?: string
  icon?: string
}

export type GuidePageContent = {
  metadata: {
    title: string
    description: string
    openGraphTitle: string
    openGraphDescription: string
  }
  hero: {
    imageUrl: string
    alt: string
    eyebrow: string
    title: string
    description: string
    downloadLabel: string
    downloadHref: string
    exploreLabel: string
    exploreHref: string
  }
  delivery: {
    description: string
    instructionPrefix: string
    downloadLabel: string
    instructionSuffix: string
    emailLabel: string
    emailHref: string
    closing: string
  }
  sectionsTitle: string
  sections: { icon: string; title: string; description: string }[]
  legal: {
    termsTitle: string
    termsText: string
    privacyTitle: string
    privacyText: string
  }
}

export type HomeContentDocument = {
  version: 1
  sectionOrder: ("features" | "imperdibles" | "events" | "planifica" | "vivi")[]
  metadata: {
    siteName: string
    title: string
    description: string
    openGraphTitle: string
    openGraphDescription: string
    keywords: string[]
  }
  hero: {
    imageUrl: string
    alt: string
    title: string
    subtitle: string
    description: string
    ctaPrimary: string
    ctaPrimaryHref: string
    ctaSecondary: string
    ctaSecondaryHref: string
  }
  header: {
    logoUrl: string
    logoAlt: string
    weatherTemperature: string
    weatherCondition: string
    siteMapLabel: string
    siteMapHref: string
    faqLabel: string
    faqHref: string
    languageLabel: string
    languages: { code: string; label: string }[]
    navItems: HomeLink[]
    ctaLabel: string
    ctaHref: string
    openMenuLabel: string
    closeMenuLabel: string
    quickLinks: HomeLink[]
    search: {
      openLabel: string
      closeLabel: string
      dialogLabel: string
      placeholder: string
      startPrompt: string
      noResultsPrefix: string
      resultCountSingular: string
      resultCountPlural: string
      resultCategoryExperiences: string
      resultCategoryEvents: string
      resultCategoryAccommodations: string
      resultCategoryRestaurants: string
      resultCategorySports: string
      footerDirectory: string
      escapeKeyLabel: string
      escapeHint: string
    }
  }
  heroEyebrow: string
  features: {
    enabled: boolean
    items: {
      icon: string
      color: string
      title: string
      description: string
      href: string
    }[]
  }
  imperdibles: {
    enabled: boolean
    title: string
    subtitle: string
    linkLabel: string
    linkHref: string
    items: HomeCollectionItem[]
  }
  events: {
    enabled: boolean
    title: string
    description: string
    buttonLabel: string
    buttonHref: string
    image: string
    imageAlt: string
    eventListTitle: string
    eventLimit: number
  }
  planifica: {
    enabled: boolean
    title: string
    items: {
      icon: string
      title: string
      description: string
      ctaLabel: string
      href: string
      download?: boolean
    }[]
  }
  vivi: {
    enabled: boolean
    title: string
    subtitle: string
    linkLabel: string
    linkHref: string
    items: HomeCollectionItem[]
  }
  footer: {
    logoUrl: string
    logoAlt: string
    tagline: string
    linksTitle: string
    links: HomeLink[]
    contactTitle: string
    phoneLabel: string
    phoneHref: string
    emailLabel: string
    emailHref: string
    locationLabel: string
    locationHref: string
    socials: HomeLink[]
    newsletterTitle: string
    newsletterDescription: string
    newsletterEmailPlaceholder: string
    newsletterSubmitLabel: string
    newsletterAction: string
    copyright: string
    creditPrefix: string
    creditSuffix: string
  }
  // Optional during the rollout so existing production JSON rows remain valid.
  guide?: GuidePageContent
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.length <= 5000
}

function isLink(value: unknown): value is HomeLink {
  return (
    isRecord(value) &&
    isText(value.label) &&
    isText(value.href) &&
    (value.icon === undefined || isText(value.icon))
  )
}

function isCollectionItem(value: unknown): value is HomeCollectionItem {
  return (
    isRecord(value) &&
    (value.source === "experience" || value.source === "sportActivity") &&
    isText(value.sourceId) &&
    ["title", "description", "image", "href", "icon"].every(
      (key) => value[key] === undefined || isText(value[key]),
    )
  )
}

export function isHomeContentDocument(
  value: unknown,
): value is HomeContentDocument {
  if (!isRecord(value) || value.version !== 1) return false
  const metadata = value.metadata
  const hero = value.hero
  const header = value.header
  const features = value.features
  const imperdibles = value.imperdibles
  const events = value.events
  const planifica = value.planifica
  const vivi = value.vivi
  const footer = value.footer
  const sectionOrder = value.sectionOrder

  if (!isRecord(metadata) || !isRecord(hero) || !isRecord(header) || !isRecord(header.search)) return false
  const search = header.search
  if (!isRecord(features) || !isRecord(imperdibles) || !isRecord(events)) return false
  if (!isRecord(planifica) || !isRecord(vivi) || !isRecord(footer)) return false
  const allowedSections = new Set(["features", "imperdibles", "events", "planifica", "vivi"])
  if (!Array.isArray(sectionOrder) || sectionOrder.length > allowedSections.size || !sectionOrder.every((section) => typeof section === "string" && allowedSections.has(section)) || new Set(sectionOrder).size !== sectionOrder.length) return false

  if (!["siteName", "title", "description", "openGraphTitle", "openGraphDescription"].every((key) => isText(metadata[key]))) return false
  if (!Array.isArray(metadata.keywords) || !metadata.keywords.every(isText)) return false
  if (!["imageUrl", "alt", "title", "subtitle", "description", "ctaPrimary", "ctaPrimaryHref", "ctaSecondary", "ctaSecondaryHref"].every((key) => isText(hero[key]))) return false
  if (!["logoUrl", "logoAlt", "weatherTemperature", "weatherCondition", "siteMapLabel", "siteMapHref", "faqLabel", "faqHref", "languageLabel", "ctaLabel", "ctaHref", "openMenuLabel", "closeMenuLabel"].every((key) => isText(header[key]))) return false
  if (!Array.isArray(header.languages) || !header.languages.every((item) => isRecord(item) && isText(item.code) && isText(item.label))) return false
  if (!Array.isArray(header.navItems) || !header.navItems.every(isLink)) return false
  if (!Array.isArray(header.quickLinks) || !header.quickLinks.every(isLink)) return false
  if (!["openLabel", "closeLabel", "dialogLabel", "placeholder", "startPrompt", "noResultsPrefix", "resultCountSingular", "resultCountPlural", "resultCategoryExperiences", "resultCategoryEvents", "resultCategoryAccommodations", "resultCategoryRestaurants", "resultCategorySports", "footerDirectory", "escapeKeyLabel", "escapeHint"].every((key) => isText(search[key]))) return false

  if (typeof value.heroEyebrow !== "string" || typeof features.enabled !== "boolean" || !Array.isArray(features.items)) return false
  if (!features.items.every((item) => isRecord(item) && ["icon", "color", "title", "description", "href"].every((key) => isText(item[key])))) return false

  if (typeof imperdibles.enabled !== "boolean" || !["title", "subtitle", "linkLabel", "linkHref"].every((key) => isText(imperdibles[key]))) return false
  if (!Array.isArray(imperdibles.items) || !imperdibles.items.every(isCollectionItem)) return false

  if (typeof events.enabled !== "boolean" || !["title", "description", "buttonLabel", "buttonHref", "image", "imageAlt", "eventListTitle"].every((key) => isText(events[key]))) return false
  if (typeof events.eventLimit !== "number" || !Number.isInteger(events.eventLimit) || events.eventLimit < 0 || events.eventLimit > 20) return false

  if (typeof planifica.enabled !== "boolean" || !isText(planifica.title) || !Array.isArray(planifica.items)) return false
  if (!planifica.items.every((item) => isRecord(item) && ["icon", "title", "description", "ctaLabel", "href"].every((key) => isText(item[key])) && (item.download === undefined || typeof item.download === "boolean"))) return false

  if (typeof vivi.enabled !== "boolean" || !["title", "subtitle", "linkLabel", "linkHref"].every((key) => isText(vivi[key]))) return false
  if (!Array.isArray(vivi.items) || !vivi.items.every(isCollectionItem)) return false

  if (!["logoUrl", "logoAlt", "tagline", "linksTitle", "contactTitle", "phoneLabel", "phoneHref", "emailLabel", "emailHref", "locationLabel", "locationHref", "newsletterTitle", "newsletterDescription", "newsletterEmailPlaceholder", "newsletterSubmitLabel", "newsletterAction", "copyright", "creditPrefix", "creditSuffix"].every((key) => isText(footer[key]))) return false
  if (!Array.isArray(footer.links) || !footer.links.every(isLink)) return false
  if (!Array.isArray(footer.socials) || !footer.socials.every(isLink)) return false

  if (value.guide !== undefined) {
    const guide = value.guide
    if (!isRecord(guide)) return false
    const guideMetadata = guide.metadata
    const guideHero = guide.hero
    const guideDelivery = guide.delivery
    const guideLegal = guide.legal
    if (!isRecord(guideMetadata) || !isRecord(guideHero) || !isRecord(guideDelivery) || !isRecord(guideLegal)) return false
    if (!["title", "description", "openGraphTitle", "openGraphDescription"].every((key) => isText(guideMetadata[key]))) return false
    if (!["imageUrl", "alt", "eyebrow", "title", "description", "downloadLabel", "downloadHref", "exploreLabel", "exploreHref"].every((key) => isText(guideHero[key]))) return false
    if (!["description", "instructionPrefix", "downloadLabel", "instructionSuffix", "emailLabel", "emailHref", "closing"].every((key) => isText(guideDelivery[key]))) return false
    if (!isText(guide.sectionsTitle) || !Array.isArray(guide.sections)) return false
    if (!guide.sections.every((item) => isRecord(item) && ["icon", "title", "description"].every((key) => isText(item[key])))) return false
    if (!["termsTitle", "termsText", "privacyTitle", "privacyText"].every((key) => isText(guideLegal[key]))) return false
  }

  return true
}

export function isSafeHomeHref(value: string): boolean {
  return (
    value.startsWith("/") && !value.startsWith("//") ||
    /^https?:\/\//i.test(value) ||
    /^(mailto|tel):/i.test(value)
  )
}
