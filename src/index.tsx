import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { SessionState } from "./session/SessionState"
import { applyGlobalStyles } from "./ui/globalStyles"

configure({ enforceActions: "observed" })

const session = new SessionState()

applyGlobalStyles()
ReactDOM.render(<App session={session} />, document.querySelector("#root"))
