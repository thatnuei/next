import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./app/components/Root"
import "./polyfills"
import useRootStore from "./useRootStore"

configure({
  enforceActions: 'observed',
  observableRequiresReaction: true,
  reactionRequiresObservable: true,
  computedRequiresReaction: true,
})

function renderRoot() {
  ReactDOM.render(
    <useRootStore.Provider>
      <Root />
    </useRootStore.Provider>,
    document.getElementById("root"),
  )
}

renderRoot()

if (module.hot) {
  module.hot.accept("./app/components/Root", renderRoot)
}
