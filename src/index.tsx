import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { loginScreen } from "./app/LoginModal"
import { selectCharacterScreen } from "./app/SelectCharacterModal"
import { navigationStore } from "./navigation/NavigationStore"
import { sessionStore } from "./session/SessionStore"
import { applyGlobalStyles } from "./ui/globalStyles"

// const AsyncMode: React.ComponentType = (React as any).unstable_AsyncMode

configure({ enforceActions: "observed" })

async function initSession() {
  try {
    await sessionStore.restoreUserData()
    navigationStore.push(selectCharacterScreen())
  } catch (error) {
    console.warn(error)
    navigationStore.push(loginScreen())
  }
}

function render() {
  ReactDOM.render(<App />, document.querySelector("#root"))
}

applyGlobalStyles()
initSession()
render()

if (module.hot) {
  module.hot.accept("./app/App", render)
  module.hot.accept("./ui/globalStyles", applyGlobalStyles)
}
