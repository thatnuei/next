import React from "react"
import { ChildrenProps } from "../jsx/types"
import { ThemeProvider } from "../ui/theme"

export type TestProvidersProps = ChildrenProps

// TODO: allow overriding root store
export default function TestProviders({ children }: TestProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>
}
