import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app/App"
import { applyGlobalStyles } from "./ui/globalStyles"

// const AsyncMode: React.ComponentType = (React as any).unstable_AsyncMode

function render() {
  ReactDOM.render(<App />, document.querySelector("#root"))
}

function main() {
  configure({ enforceActions: "observed" })
  applyGlobalStyles()
  render()
}

main()
