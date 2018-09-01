import { configure } from "mobx"
import DevTools from "mobx-react-devtools"
import React from "react"
import ReactDOM from "react-dom"
import { Session } from "./session/Session"
import { SessionState } from "./session/SessionState"
import { applyGlobalStyles } from "./ui/globalStyles"

// const AsyncMode: React.ComponentType = (React as any).unstable_AsyncMode

configure({ enforceActions: "observed" })

const session = new SessionState()

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
  const root = (
    <>
      <Session state={session} />
      <DevTools position={{ left: 50, bottom: 8 }} />
    </>
  )

  applyGlobalStyles()
  ReactDOM.render(root, document.querySelector("#root"))
}

initSession()
render()

if (module.hot) {
  module.hot.accept(["./session/Session", "./ui/globalStyles"], render)
}
