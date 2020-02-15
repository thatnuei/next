import { render } from "@testing-library/react"
import React from "react"
import { midnightTheme, ThemeProvider } from "../ui/theme"

export function renderWithProviders(children: React.ReactNode) {
  return render(<ThemeProvider theme={midnightTheme}>{children}</ThemeProvider>)
}
