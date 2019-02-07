import { observer } from "mobx-react-lite"
import React from "react"
import { useRootStore } from "../RootStore"
import CharacterSelectRoute from "./CharacterSelectRoute"
import LoginRoute from "./LoginRoute"

function App() {
  const { viewStore } = useRootStore()

  switch (viewStore.screen) {
    case "setup":
      return <p>Setting things up...</p>

    case "login":
      return <LoginRoute />

    case "characterSelect":
      return <CharacterSelectRoute />

    default:
      return <div>chat eventually</div>
  }
}

export default observer(App)
