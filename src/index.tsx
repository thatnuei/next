import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import AppStore from "./app/AppStore"
import { RouterProvider } from "./app/routerContext"
import Root from "./Root.test"

function renderApp() {
  ReactDOM.render(
    <BrowserRouter>
      <RouterProvider>
        <AppStore.Provider>
          <Root />
        </AppStore.Provider>
      </RouterProvider>
    </BrowserRouter>,
    document.querySelector("#root"),
  )
}

function main() {
  renderApp()

  if (module.hot) {
    module.hot.accept("./Root.test", renderApp)
  }
}

main()
