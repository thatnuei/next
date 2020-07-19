import { pick } from "lodash/fp"
import { useObserver } from "mobx-react-lite"
import React from "react"
import Chat from "../chat/Chat"
import ChatContainer from "../chat/ChatContainer"
import { useRootStore } from "../root/rootStoreContext"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export default function App() {
  const root = useRootStore()

  return useObserver(() => {
    const { appStore } = root
    if (appStore.screen === "login") {
      return <Login onSuccess={appStore.handleLoginSuccess} />
    }

    if (appStore.screen === "characterSelect") {
      return (
        <CharacterSelect
          characters={appStore.characters}
          initialCharacter={appStore.identity}
          onSubmit={appStore.enterChat}
          onReturnToLogin={appStore.showLogin}
        />
      )
    }

    if (appStore.screen === "chat") {
      const creds = pick(["account", "ticket", "identity"], appStore)
      return (
        <ChatContainer {...creds}>
          <Chat onDisconnect={appStore.showLogin} />
        </ChatContainer>
      )
    }

    return null
  })
}
