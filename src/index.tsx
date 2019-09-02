import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import Root from "./app/Root"
import { createAppStore } from "./store"

const store = createAppStore()

function renderRoot() {
  ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById("root"),
  )
}

renderRoot()

if (module.hot) {
  module.hot.accept("./app/Root", renderRoot)
}
