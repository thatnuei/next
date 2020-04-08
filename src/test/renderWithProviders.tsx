import { render } from "@testing-library/react"
import React from "react"
import ChatContainer from "../chat/ChatContainer"
import { ThemeProvider } from "../ui/theme"

export function renderWithProviders(children: React.ReactNode) {
  return render(
    <ThemeProvider>
      <ChatContainer account="test" ticket="test" identity="Testificate">
        {children}
      </ChatContainer>
    </ThemeProvider>,
  )
}
