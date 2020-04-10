import { render } from "@testing-library/react"
import React from "react"
import ChatContainer from "../chat/ChatContainer"
import { ApiProvider } from "../flist/api-context"
import { ThemeProvider } from "../ui/theme"

export function renderWithProviders(children: React.ReactNode) {
  return render(
    <ThemeProvider>
      <ApiProvider>
        <ChatContainer account="test" ticket="test" identity="Testificate">
          {children}
        </ChatContainer>
      </ApiProvider>
    </ThemeProvider>,
  )
}
