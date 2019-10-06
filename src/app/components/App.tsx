import { observer } from "mobx-react-lite"
import React from "react"
import Chat from "../../chat/components/Chat"
import useRootStore from "../../useRootStore"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

function App() {
  const { appStore } = useRootStore()
  switch (appStore.view) {
    case "login":
      return <Login />
    case "characterSelect":
      return <CharacterSelect />
    case "chat":
      return <Chat />
  }
}

export default observer(App)
