import clsx from "clsx"
import type { ReactNode } from "react"

export default function StalenessState({
  isStale,
  children,
}: {
  isStale: boolean
  children: ReactNode
}) {
  return (
    <div
      className={clsx(
        "h-full transition-opacity",
        isStale ? "opacity-50 transition-delay-300" : "opacity-100",
      )}
    >
      {children}
    </div>
  )
}
