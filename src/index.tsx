import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import SessionContainer from "./session/SessionContainer"
import GlobalStyle from "./ui/GlobalStyle"

function render() {
  ReactDOM.render(
    <>
      <SessionContainer.Provider>
        <App />
      </SessionContainer.Provider>
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
