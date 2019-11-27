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

const domRoot = document.getElementById("root")!

function renderRoot() {
  ReactDOM.render(
    <useRootStore.Provider>
      <Root />
    </useRootStore.Provider>,
    domRoot,
  )
}

renderRoot()

if (module.hot) {
  module.hot.accept("./app/components/Root", renderRoot)
}
