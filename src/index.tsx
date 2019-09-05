import { Provider } from "overmind-react"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./app/components/Root"
import { createAppStore } from "./store/index"

const store = createAppStore()

function renderRoot() {
  ReactDOM.render(
    <Provider value={store}>
      <Root />
    </Provider>,
    document.getElementById("root"),
  )
}

renderRoot()

if (module.hot) {
  module.hot.accept("./app/Root", renderRoot)
}
