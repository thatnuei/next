import { Global } from "@emotion/core"
import React from "react"
import App from "./app/App"
import AppStore from "./app/AppStore"
import globalStyle from "./ui/globalStyle"

const Root = () => (
  <AppStore.Provider>
    <App />
    <Global styles={globalStyle} />
  </AppStore.Provider>
)

export default Root
