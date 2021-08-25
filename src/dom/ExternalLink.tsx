import type { ComponentProps, ReactNode } from "react"
import { autoRef } from "../react/autoRef"

export default autoRef(function ExternalLink({
  children,
  ...props
}: ComponentProps<"a"> & { children: ReactNode }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
})
