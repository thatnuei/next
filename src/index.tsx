import "focus-visible"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import Root from "./Root"
import RootStore, { RootStoreContext } from "./RootStore"

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

function renderRoot(store = new RootStore()) {
  return (
    <RootStoreContext.Provider value={store}>
      <Root />
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
