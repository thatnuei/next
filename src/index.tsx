import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createAppStore } from "./store"
import App from "./view/App"

const store = createAppStore()

function renderApp() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root"),
  )
}

renderApp()

if (module.hot) {
  module.hot.accept("./view/App", renderApp)
}
