import React from "react"
import ChatContainer from "../chat/ChatContainer"
import { ChildrenProps } from "../jsx/types"
import { ThemeProvider } from "../ui/theme"

export type TestProvidersProps = ChildrenProps

// TODO: allow overriding root store
export default function TestProviders({ children }: TestProvidersProps) {
  return (
    <ThemeProvider>
      <ChatContainer account="test" ticket="test" identity="Testificate">
        {children}
      </ChatContainer>
    </ThemeProvider>
  )
}
