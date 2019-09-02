import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createAppStore } from "./store"
import Root from "./view/Root"

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
  module.hot.accept("./view/Root", renderRoot)
}
