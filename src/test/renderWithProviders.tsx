import { render } from "@testing-library/react"
import React from "react"
import ChatProviders from "../chat/ChatRoot"
import { ThemeProvider } from "../ui/theme"

export function renderWithProviders(children: React.ReactNode) {
  return render(
    <ThemeProvider>
      <ChatProviders account="test" ticket="test" identity="Testificate">
        {children}
      </ChatProviders>
    </ThemeProvider>,
  )
}
