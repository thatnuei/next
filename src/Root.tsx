import { Grommet } from "grommet"
import React from "react"
import App from "./app/App"
import AppDocumentTitle from "./ui/AppDocumentTitle"
import GlobalStyle from "./ui/globalStyle"
import { darkTheme } from "./ui/theme"

const Root = () => (
  <AppDocumentTitle>
    <Grommet theme={darkTheme}>
      <App />
      <GlobalStyle />
    </Grommet>
  </AppDocumentTitle>
)

export default Root
