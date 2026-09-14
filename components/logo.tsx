import Image from "next/image"
import { cn } from "@/lib/utils"

export function LeafMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo-turismo.png"
      alt="Eldorado Misiones"
      width={2014}
      height={749}
      className={cn("h-10 w-auto", className)}
    />
  )
}

export function Logo({
  className,
  src,
  alt,
}: {
  className?: string
  src?: string
  alt?: string
}) {
  return (
    <Image
      src={src ?? "/images/logo-turismo.png"}
      alt={alt ?? "Eldorado Misiones - Turismo"}
      width={2014}
      height={749}
      className={cn("h-10 w-auto", className)}
      priority
    />
  )
}
