import React from "react"
import ReactDOM from "react-dom"
import AppStore from "./app/AppStore"
import Root from "./Root"

function renderApp() {
  ReactDOM.render(
    <AppStore.Provider>
      <Root />
    </AppStore.Provider>,
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
