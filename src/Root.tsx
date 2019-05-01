import React from "react"
import { ThemeProvider } from "styled-components"
import App from "./app/App"
import OverlayRenderer from "./overlay/OverlayRenderer"
import GlobalStyle from "./ui/globalStyle"
import { baseTheme } from "./ui/theme"

const Root = () => (
  <ThemeProvider theme={baseTheme}>
    <>
      <App />
      <GlobalStyle />
      <OverlayRenderer />
    </>
  </ThemeProvider>
)

export default Root
