import { configure } from "mobx"
import "mobx-react-lite/batchingForReactDom"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./Root"

configure({
  reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  // computedRequiresReaction: true,
})

ReactDOM.render(<Root />, document.getElementById("root"))

if (module.hot) {
  module.hot.accept("./Root", () => {
    ReactDOM.render(<Root />, document.getElementById("root"))
  })
}
