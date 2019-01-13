import { Global } from "@emotion/core"
import React from "react"
import App from "./app/App"
import globalStyle from "./ui/globalStyle"

const Root = () => (
  <>
    <App />
    <Global styles={globalStyle} />
  </>
)

export default Root
