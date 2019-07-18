import React from "react"
import App from "./app/App"
import { AppNavigationProvider } from "./app/appNavigation"
import GlobalStyle from "./ui/globalStyle"
import { baseTheme, ThemeProvider } from "./ui/theme"

const Root = () => (
  <ThemeProvider theme={baseTheme}>
    <AppNavigationProvider>
      <App />
    </AppNavigationProvider>
    <GlobalStyle />
  </ThemeProvider>
)

export default Root
