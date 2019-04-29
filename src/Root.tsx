import React from "react"
import { ThemeProvider } from "styled-components"
import App from "./app/App"
import GlobalStyle from "./ui/globalStyle"
import { baseTheme } from "./ui/theme.new"

const Root = () => (
  <ThemeProvider theme={baseTheme}>
    <>
      <App />
      <GlobalStyle />
    </>
  </ThemeProvider>
)

export default Root
