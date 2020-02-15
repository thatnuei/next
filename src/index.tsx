import { Global } from "@emotion/react"
import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import { FocusVisible } from "./ui/FocusVisible"
import { reset } from "./ui/reset"
import { midnightTheme, ThemeProvider } from "./ui/theme"

ReactDOM.render(
  <ThemeProvider theme={midnightTheme}>
    <App />
    <Global styles={reset} />
    <FocusVisible />
  </ThemeProvider>,
  document.getElementById("root"),
)
