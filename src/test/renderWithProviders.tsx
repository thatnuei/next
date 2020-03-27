import { render } from "@testing-library/react"
import React from "react"
import { ThemeProvider } from "../ui/theme"

export function renderWithProviders(children: React.ReactNode) {
  return render(<ThemeProvider>{children}</ThemeProvider>)
}
