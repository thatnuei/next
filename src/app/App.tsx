import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo } from "react"
import Chat from "../chat/Chat"
import FListApi from "../flist/FListApi"
import { AppStore } from "./AppStore"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

const api = new FListApi()

function App() {
  const appStore = useMemo(() => new AppStore(api), [])

  useEffect(() => {
    appStore.restoreSession()
  }, [appStore])

  switch (appStore.view) {
    case "loading":
      return <p>Setting things up...</p>

    case "login":
      return (
        <Login
          disabled={appStore.loginLoading}
          error={appStore.loginError}
          onSubmit={appStore.submitLogin}
        />
      )

    case "characterSelect":
      return (
        <CharacterSelect
          characters={appStore.userData?.characters ?? []}
          identity={appStore.identity}
          onIdentityChange={appStore.setIdentity}
          onReturnToLogin={appStore.showLogin}
          onSubmit={appStore.showChat}
        />
      )

    case "chat":
      return (
        <Chat
          {...appStore.session}
          onClose={appStore.handleSocketClosed}
          onConnectionError={appStore.handleConnectionError}
        />
      )
  }
}

export default observer(App)
