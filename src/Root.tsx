import React from "react"
import App from "./app/App"
import FocusVisible from "./ui/FocusVisible"
import Reset from "./ui/Reset"
import { midnightTheme, ThemeProvider } from "./ui/theme"

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={midnightTheme}>
        <App />
        <Reset />
        <FocusVisible />
      </ThemeProvider>
    </React.StrictMode>
  )
}
