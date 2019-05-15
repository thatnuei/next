import React from "react"
import App from "./app/App"
import GlobalStyle from "./ui/globalStyle"
import { baseTheme, ThemeProvider } from "./ui/theme"

const Root = () => (
  <ThemeProvider theme={baseTheme}>
    <App />
    <GlobalStyle />
  </ThemeProvider>
)

export default Root
