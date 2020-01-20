import React from "react"
import { baseTheme } from "../ui/theme"
import { ThemeProvider } from "../ui/themeContext"
import App from "./App"

function Root() {
  return (
    <ThemeProvider theme={baseTheme}>
      <App />
    </ThemeProvider>
  )
}

export default Root
