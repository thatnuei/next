import { Global } from "@emotion/react"
import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import FocusVisible from "./ui/FocusVisible"
import { reset } from "./ui/reset"
import { midnightTheme, ThemeProvider } from "./ui/theme"

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={midnightTheme}>
      <App />
      <Global styles={reset} />
      <FocusVisible />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)
