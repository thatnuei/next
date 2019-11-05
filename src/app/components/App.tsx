import { observer } from "mobx-react-lite"
import React from "react"
import Chat from "../../chat/components/Chat"
import useRootStore from "../../useRootStore"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

function App() {
  const { appStore, userStore } = useRootStore()

  switch (appStore.view) {
    case "login":
      return (
        <Login
          isLoading={userStore.loginState.type === "loading"}
          error={
            userStore.loginState.type === "error"
              ? userStore.loginState.error
              : undefined
          }
          onSubmit={userStore.submitLogin}
        />
      )

    case "characterSelect":
      return <CharacterSelect />

    case "chat":
      return <Chat />
  }
}

export default observer(App)
