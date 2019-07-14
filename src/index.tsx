import "focus-visible"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import Root from "./Root"
import RootStore, { RootStoreContext } from "./RootStore"

function HotReloader() {
  const [store, setStore] = useState(() => new RootStore())
  const [, update] = useState(false)

  useEffect(() => {
    store.init()
    return () => store.cleanup()
  }, [store])

  useEffect(() => {
    if (module.hot) {
      module.hot.accept("./Root", () => update((v) => !v))
      module.hot.accept("./RootStore", () => setStore(new RootStore()))
    }
  }, [])

  return (
    <RootStoreContext.Provider value={store}>
      <Root />
    </RootStoreContext.Provider>
  )
}

function renderApp() {
  if (process.env.NODE_ENV === "development") {
    ReactDOM.render(<HotReloader />, document.querySelector("#root"))
    return
  }

  ReactDOM.render(
    <RootStoreContext.Provider value={new RootStore()}>
      <Root />
    </RootStoreContext.Provider>,
    document.querySelector("#root"),
  )
}

renderApp()
