import { configure, runInAction } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { Chat } from "./chat/Chat"
import { SessionState } from "./session/SessionState"
import { applyGlobalStyles } from "./ui/globalStyles"

configure({ enforceActions: "observed" })

const session = new SessionState()

runInAction(() => {
  session.chat.identity = "Isla Strider"
})

function render() {
  // const root = <Session state={session} />
  const root = <Chat session={session} />

  applyGlobalStyles()
  ReactDOM.render(root, document.querySelector("#root"))
}

render()

if (module.hot) {
  module.hot.accept(["./chat/Chat", "./ui/globalStyles"], render)
}
