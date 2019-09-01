import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import App from "./components/App"
import { createAppStore } from "./store"

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
  module.hot.accept("./components/App", renderApp)
}
