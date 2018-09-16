import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { AppStore } from "./app/AppStore"
import { applyGlobalStyles } from "./ui/globalStyles"

// const AsyncMode: React.ComponentType = (React as any).unstable_AsyncMode

function render(appStore: AppStore) {
  ReactDOM.render(<App store={appStore} />, document.querySelector("#root"))
}

function main() {
  configure({ enforceActions: "observed" })

  const appStore = new AppStore()
  appStore.init()

  applyGlobalStyles()
  render(appStore)
}

main()
