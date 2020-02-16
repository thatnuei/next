import { Global } from "@emotion/react"
import React from "react"
import App from "./app/App"
import FocusVisible from "./ui/FocusVisible"
import { reset } from "./ui/reset"
import { midnightTheme, ThemeProvider } from "./ui/theme"

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={midnightTheme}>
        <App />
        <Global styles={reset} />
        <FocusVisible />
      </ThemeProvider>
    </React.StrictMode>
  )
}
