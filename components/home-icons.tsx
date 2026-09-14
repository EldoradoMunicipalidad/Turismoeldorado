import {
  Bike,
  BookOpen,
  Camera,
  Footprints,
  Home,
  Info,
  Leaf,
  Map,
  MapPin,
  Mountain,
  Navigation,
  Trophy,
  Users,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  bike: Bike,
  book: BookOpen,
  camera: Camera,
  footprints: Footprints,
  home: Home,
  info: Info,
  leaf: Leaf,
  map: Map,
  pin: MapPin,
  mountain: Mountain,
  navigation: Navigation,
  trophy: Trophy,
  users: Users,
  utensils: Utensils,
  waves: Waves,
}

export function HomeIcon({
  name,
  className,
}: {
  name?: string
  className?: string
}) {
  const Icon = name ? ICONS[name] : undefined
  return Icon ? <Icon className={className} aria-hidden="true" /> : null
}
