import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { Session } from "./app/Session"
import { SessionState } from "./session/SessionState"
import { applyGlobalStyles } from "./ui/globalStyles"

configure({ enforceActions: "observed" })

const session = new SessionState()

applyGlobalStyles()
ReactDOM.render(<Session state={session} />, document.querySelector("#root"))
