import { Grommet } from "grommet"
import React from "react"
import App from "./app/App"
import GlobalStyle from "./ui/globalStyle"
import { darkTheme } from "./ui/theme"

const Root = () => (
  <Grommet theme={darkTheme}>
    <App />
    <GlobalStyle />
  </Grommet>
)

export default Root
