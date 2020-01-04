import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import FListApi from "../../flist/FListApi"
import { AppStore } from "../AppStore"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

const api = new FListApi()

function App() {
  const appStore = useMemo(() => new AppStore(api), [])

  switch (appStore.view) {
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
      return <p>chat</p>
  }
}

export default observer(App)
