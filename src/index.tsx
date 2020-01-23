/// <reference types="react-dom/experimental" />
import "focus-visible"
import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./app/Root"
import "./ui/index.css"

configure({
  reactionRequiresObservable: true,
})

ReactDOM.render(<Root />, document.getElementById("root"))
