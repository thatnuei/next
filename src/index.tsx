import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { applyGlobalStyles } from "./ui/globalStyles"

function render() {
  ReactDOM.render(<App />, document.querySelector("#root"))
}

function main() {
  configure({ enforceActions: "observed" })
  applyGlobalStyles()
  render()

  if (module.hot) {
    module.hot.accept("./app/App", () => render())
  }
}

main()
