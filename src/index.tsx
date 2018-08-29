import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { applyGlobalStyles } from "./ui/globalStyles"

applyGlobalStyles()
ReactDOM.render(<App />, document.querySelector("#root"))
