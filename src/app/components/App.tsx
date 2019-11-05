import { observer } from "mobx-react-lite"
import React from "react"
import Chat from "../../chat/components/Chat"
import useRootStore from "../../useRootStore"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

function App() {
  const {
    appStore,
    userStore,
    chatStore,
    identity,
    userCredentials,
  } = useRootStore()

  switch (appStore.view) {
    case "login": {
      const error =
        userStore.loginState.type === "error"
          ? userStore.loginState.error
          : undefined

      return (
        <Login
          isLoading={userStore.loginState.type === "loading"}
          error={error}
          onSubmit={userStore.submitLogin}
        />
      )
    }

    case "characterSelect":
      return (
        <CharacterSelect
          identity={identity.current}
          characters={userCredentials.value.characters}
          disabled={chatStore.isConnecting}
          onIdentityChange={identity.set}
          onReturnToLogin={appStore.showLogin}
          onSubmit={chatStore.connectToChat}
        />
      )

    case "chat":
      return <Chat />
  }
}

export default observer(App)
