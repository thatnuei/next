import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./Root"
import RootStore, { RootStoreContext } from "./RootStore"

const store = new RootStore()

function renderApp() {
  ReactDOM.render(
    <RootStoreContext.Provider value={store}>
      <Root />
    </RootStoreContext.Provider>,
    document.querySelector("#root"),
  )
}

function main() {
  configure({ enforceActions: "observed" })

  store.userStore.restoreUserData()

  renderApp()

  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./Root", renderApp)
    }

    window.store = store
  }
}

main()

declare global {
  interface Window {
    store?: RootStore
  }
}
