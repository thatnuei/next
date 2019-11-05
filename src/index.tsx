/// <reference types="react-dom/experimental" />
import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./app/components/Root"
import useRootStore from "./useRootStore"

configure({
  enforceActions: "observed",
  reactionRequiresObservable: true,
  // this gives too many false positives
  // observableRequiresReaction: true,
})

const root = ReactDOM.createRoot(document.getElementById("root")!)

function renderRoot() {
  root.render(
    <useRootStore.Provider>
      <Root />
    </useRootStore.Provider>,
  )
}

renderRoot()

if (module.hot) {
  module.hot.accept("./app/components/Root", renderRoot)
}
