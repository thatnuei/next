import { Global } from "@emotion/core"
import React from "react"
import App from "./app/App"
import AppDocumentTitle from "./ui/AppDocumentTitle"
import globalStyle from "./ui/globalStyle"

const Root = () => (
  <AppDocumentTitle>
    <App />
    <Global styles={globalStyle} />
  </AppDocumentTitle>
)

export default Root
