import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { applyGlobalStyles } from "./ui/globalStyles"

configure({ enforceActions: "observed" })

applyGlobalStyles()
ReactDOM.render(<App />, document.querySelector("#root"))
