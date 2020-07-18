import { pick } from "lodash/fp"
import { observable } from "mobx"
import { useObserver } from "mobx-react-lite"
import React, { useMemo } from "react"
import { RecoilRoot } from "recoil"
import Chat from "../chat/Chat"
import ChatContainer from "../chat/ChatContainer"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"
import CharacterSelect from "./CharacterSelect"
import Login, { LoginResult } from "./Login"

type AppScreen = "login" | "characterSelect" | "chat"

const storedIdentity = (account: string) =>
  createStoredValue(`${account}:identity`, v.string)

class AppStore {
  @observable screen: AppScreen = "login"
  @observable account = ""
  @observable ticket = ""
  @observable.ref characters: string[] = []
  @observable identity = ""

  handleLoginSuccess = async ({ account, ticket, characters }: LoginResult) => {
    const identity = await storedIdentity(account)
      .get()
      .catch((error) => {
        console.warn("could not load stored identity", error)
        return undefined
      })

    this.account = account
    this.ticket = ticket
    this.characters = characters
    this.identity = identity || characters[0]
    this.screen = "characterSelect"
  }

  enterChat = (identity: string) => {
    storedIdentity(this.account).set(identity)
    this.identity = identity
    this.screen = "chat"
  }

  showLogin = () => {
    this.screen = "login"
  }
}

export default function App() {
  const store = useMemo(() => new AppStore(), [])

  return useObserver(() => {
    if (store.screen === "login") {
      return <Login onSuccess={store.handleLoginSuccess} />
    }

    if (store.screen === "characterSelect") {
      return (
        <CharacterSelect
          characters={store.characters}
          initialCharacter={store.identity}
          onSubmit={store.enterChat}
          onReturnToLogin={store.showLogin}
        />
      )
    }

    if (store.screen === "chat") {
      const creds = pick(["account", "ticket", "identity"], store)
      return (
        <RecoilRoot>
          <ChatContainer {...creds}>
            <Chat onDisconnect={store.showLogin} />
          </ChatContainer>
        </RecoilRoot>
      )
    }

    return null
  })
}
