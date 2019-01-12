import { Global } from "@emotion/core"
import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import AppStore from "./app/AppStore"
import globalStyle from "./ui/globalStyle"

function render() {
  ReactDOM.render(
    <AppStore.Provider>
      <App />
      <Global styles={globalStyle} />
    </AppStore.Provider>,
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
