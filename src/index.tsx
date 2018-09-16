import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { AppStore } from "./app/AppStore"
import { StoreProvider } from "./app/StoreContext"
import { applyGlobalStyles } from "./ui/globalStyles"

// const AsyncMode: React.ComponentType = (React as any).unstable_AsyncMode

function render(appStore: AppStore) {
  ReactDOM.render(
    <StoreProvider value={appStore}>
      <App />
    </StoreProvider>,
    document.querySelector("#root"),
  )
}

function main() {
  configure({ enforceActions: "observed" })

  const appStore = new AppStore()
  appStore.init()

  applyGlobalStyles()
  render(appStore)

  if (module.hot) {
    module.hot.accept("./app/App", () => render(appStore))
  }
}

main()
