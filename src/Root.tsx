import React from "react"
import App from "./app/App"
import DevTools from "./app/DevTools"
import FocusVisible from "./ui/FocusVisible"
import Reset from "./ui/Reset"
import { ThemeProvider } from "./ui/theme"

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <App />
        <Reset />
        <FocusVisible />
        {process.env.NODE_ENV === "development" && <DevTools />}
      </ThemeProvider>
    </React.StrictMode>
  )
}
