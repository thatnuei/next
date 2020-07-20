import { useObservable } from "micro-observables"
import React from "react"
import { RecoilRoot } from "recoil"
import Chat from "../chat/Chat"
import { useRootStore } from "../root/context"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export default function App() {
  const root = useRootStore()
  const screen = useObservable(root.appStore.screen)
  const userData = useObservable(root.userStore.userData)
  const identity = useObservable(root.appStore.identity)

  if (screen === "login") {
    return <Login />
  }

  if (screen === "characterSelect") {
    return (
      <CharacterSelect
        characters={userData.characters}
        initialCharacter={identity}
        onSubmit={root.appStore.enterChat}
        onReturnToLogin={root.appStore.showLogin}
      />
    )
  }

  if (screen === "chat") {
    return <RecoilRoot>{<Chat />}</RecoilRoot>
  }

  return null
}
