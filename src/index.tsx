import "focus-visible"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import useAppNavigation from "./app/useAppNavigation"
import Root from "./Root"
import RootStore, { RootStoreContext } from "./RootStore"
import { createAppStore } from "./store"

declare global {
  interface Window {
    store?: RootStore
  }
}

function HotReloader() {
  const [store, setStore] = useState(() => new RootStore())
  const [, update] = useState(false)

  useEffect(() => {
    store.init()
    window.store = store

    return () => store.cleanup()
  }, [store])

  useEffect(() => {
    if (module.hot) {
      module.hot.accept("./Root", () => update((v) => !v))
      module.hot.accept("./RootStore", () => setStore(new RootStore()))
    }
  }, [])

  return renderRoot(store)
}

const reduxStore = createAppStore()

function renderRoot(store = new RootStore()) {
  return (
    <RootStoreContext.Provider value={store}>
      <useAppNavigation.Provider>
        <Provider store={reduxStore}>
          <Root />
        </Provider>
      </useAppNavigation.Provider>
    </RootStoreContext.Provider>
  )
}

function main() {
  if (process.env.NODE_ENV === "development") {
    ReactDOM.render(<HotReloader />, document.querySelector("#root"))
    return
  }

  ReactDOM.render(renderRoot(), document.querySelector("#root"))
}

main()
