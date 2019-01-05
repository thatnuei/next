import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import GlobalStyle from "./ui/GlobalStyle"

function render() {
  ReactDOM.render(
    <>
      <App />
      <GlobalStyle />
    </>,
    document.querySelector("#root"),
  )
}

function main() {
  configure({ enforceActions: "observed" })
  render()

  if (module.hot) {
    module.hot.accept("./app/App", () => render())
  }
}

main()
