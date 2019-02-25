import React from "react"
import App from "./app/App"
import AppDocumentTitle from "./ui/AppDocumentTitle"
import GlobalStyle from "./ui/globalStyle"

const Root = () => (
  <AppDocumentTitle>
    <App />
    <GlobalStyle />
  </AppDocumentTitle>
)

export default Root
