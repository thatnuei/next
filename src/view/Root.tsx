import React from "react"
import App from "./App"
import GlobalStyle from "./ui/globalStyle"
import { baseTheme } from "./ui/theme"
import { ThemeProvider } from "./ui/themeContext"

function Root() {
  return (
    <ThemeProvider theme={baseTheme}>
      <App />
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default Root
