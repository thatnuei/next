import { useObservable } from "micro-observables"
import React from "react"
import Chat from "../chat/Chat"
import ChatContainer from "../chat/ChatContainer"
import { useRootStore } from "../root/rootStoreContext"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export default function App() {
  const { appStore } = useRootStore()
  const screen = useObservable(appStore.screen)
  const userData = useObservable(appStore.userData)
  const identity = useObservable(appStore.identity)

  if (screen === "login") {
    return <Login onSuccess={appStore.handleLoginSuccess} />
  }

  if (screen === "characterSelect") {
    return (
      <CharacterSelect
        characters={userData.characters}
        initialCharacter={identity}
        onSubmit={appStore.enterChat}
        onReturnToLogin={appStore.showLogin}
      />
    )
  }

  if (screen === "chat") {
    const { account, ticket } = userData
    return (
      <ChatContainer {...{ account, ticket, identity }}>
        <Chat onDisconnect={appStore.showLogin} />
      </ChatContainer>
    )
  }

  return null
}
