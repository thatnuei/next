import React from "react"
import GlobalStyle from "../ui/components/GlobalStyle"
import { baseTheme } from "../ui/theme"
import { ThemeProvider } from "../ui/themeContext"
import App from "./App"

function Root() {
  return (
    <ThemeProvider theme={baseTheme}>
      <App />
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default Root