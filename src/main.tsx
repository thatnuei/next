import { configure } from "mobx"
import { observerBatching } from "mobx-react-lite"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./Root"

observerBatching(ReactDOM.unstable_batchedUpdates as any)

configure({
  reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  // computedRequiresReaction: true,
})

ReactDOM.render(<Root />, document.getElementById("root"))
