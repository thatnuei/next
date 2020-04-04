import { render } from "@testing-library/react"
import React from "react"
import { ChatStateProvider } from "../chat/chatStateContext"
import { ThemeProvider } from "../ui/theme"

export function renderWithProviders(children: React.ReactNode) {
  return render(
    <ThemeProvider>
      <ChatStateProvider>{children}</ChatStateProvider>
    </ThemeProvider>,
  )
}
