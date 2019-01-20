import React from "react"
import ReactDOM from "react-dom"
import AppStore from "./app/AppStore"
import Root from "./Root"
import { Router } from "./router"

function renderApp() {
  ReactDOM.render(
    <Router>
      <AppStore.Provider>
        <Root />
      </AppStore.Provider>
    </Router>,
    document.querySelector("#root"),
  )
}

function main() {
  renderApp()

  if (module.hot) {
    module.hot.accept("./Root", renderApp)
  }
}

main()
