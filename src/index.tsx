import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./Root"
import { Router } from "./router"

function renderApp() {
  ReactDOM.render(
    <Router>
      <Root />
    </Router>,
    document.querySelector("#root"),
  )
}

function main() {
  configure({
    enforceActions: "observed",
  })

  renderApp()

  if (module.hot) {
    module.hot.accept("./Root", renderApp)
  }
}

main()
