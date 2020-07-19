import React from "react"
import App from "../app/App"
import DevTools from "../app/DevTools"
import { ApiProvider } from "../flist/api-context"
import FocusVisible from "../ui/FocusVisible"
import Reset from "../ui/Reset"
import { ThemeProvider } from "../ui/theme"

export default function Root() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <App />
        <Reset />
        <FocusVisible />
        {process.env.NODE_ENV === "development" && <DevTools />}
      </ApiProvider>
    </ThemeProvider>
  )
}
