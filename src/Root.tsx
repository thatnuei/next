import React from "react"
import App from "./app/App"
import useAppNavigation from "./app/useAppNavigation"
import GlobalStyle from "./ui/globalStyle"
import { baseTheme, ThemeProvider } from "./ui/theme"

const Root = () => (
  <ThemeProvider theme={baseTheme}>
    <useAppNavigation.Provider>
      <App />
    </useAppNavigation.Provider>
    <GlobalStyle />
  </ThemeProvider>
)

export default Root
