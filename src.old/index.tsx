import { Global } from "@emotion/core"
import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import AppStateContainer from "./app/AppStateContainer"
import globalStyle from "./ui/globalStyle"

function render() {
  ReactDOM.render(
    <AppStateContainer.Provider>
      <App />
      <Global styles={globalStyle} />
    </AppStateContainer.Provider>,
    document.querySelector("#root"),
  )
}

function main() {
  render()

  if (module.hot) {
    module.hot.accept("./app/App", () => render())
  }
}

main()
