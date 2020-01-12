/// <reference types="react-dom/experimental" />
import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./app/Root"
import "./ui/tailwind.css"

configure({
  reactionRequiresObservable: true,
})

const domRoot = document.getElementById("root")!

function renderRoot() {
  ReactDOM.render(<Root />, domRoot)
}

renderRoot()

if (module.hot) {
  module.hot.accept("./app/components/Root", renderRoot)
}
