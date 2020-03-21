import React from "react"
import App from "./app/App"
import DevTools from "./app/DevTools"
import FocusVisible from "./ui/FocusVisible"
import Reset from "./ui/Reset"
import { ThemeProvider } from "./ui/theme"
import {
  midnightTheme,
  ThemeProvider as OldThemeProvider,
} from "./ui/theme.old"

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <OldThemeProvider theme={midnightTheme}>
          <App />
          <Reset />
          <FocusVisible />
          {process.env.NODE_ENV === "development" && <DevTools />}
        </OldThemeProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
