import React from "react"
import OverlayRenderer from "../../overlay/OverlayRenderer"
import GlobalStyle from "../../ui/components/GlobalStyle"
import { baseTheme } from "../../ui/theme"
import { ThemeProvider } from "../../ui/themeContext"
import App from "./App"

function Root() {
  return (
    <ThemeProvider theme={baseTheme}>
      <App />
      <GlobalStyle />
      <OverlayRenderer />
    </ThemeProvider>
  )
}

export default Root
