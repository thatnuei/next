import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { SessionStore } from "./session/SessionStore"
import { applyGlobalStyles } from "./ui/globalStyles"

// const AsyncMode: React.ComponentType = (React as any).unstable_AsyncMode

configure({ enforceActions: "observed" })

const session = new SessionStore()

async function initSession() {
  try {
    await session.restoreUserData()
    session.setScreen("selectCharacter")
  } catch (error) {
    console.warn(error)
    session.setScreen("login")
  }
}

function render() {
  ReactDOM.render(<App session={session} />, document.querySelector("#root"))
}

applyGlobalStyles()
initSession()
render()

if (module.hot) {
  module.hot.accept("./app/App", render)
  module.hot.accept("./ui/globalStyles", applyGlobalStyles)
}
