import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { chatStore } from "./chat/ChatStore"
import { applyGlobalStyles } from "./ui/globalStyles"

configure({ enforceActions: "observed" })

chatStore.setupListeners()

applyGlobalStyles()
ReactDOM.render(<App />, document.querySelector("#root"))
