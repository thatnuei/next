import { useObservable } from "micro-observables"
import React from "react"
import Chat from "../chat/Chat"
import { useRootStore } from "../root/context"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export default function App() {
  const root = useRootStore()
  const screen = useObservable(root.appStore.screen)

  return (
    <>
      {screen === "login" && <Login />}
      {screen === "characterSelect" && <CharacterSelect />}
      {screen === "chat" && <Chat />}
    </>
  )
}
