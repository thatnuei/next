import React, { useState } from "react"
import { RecoilRoot } from "recoil"
import Chat from "../chat/Chat"
import ChatContainer from "../chat/ChatContainer"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"
import CharacterSelect from "./CharacterSelect"
import Login, { LoginSuccessData } from "./Login"

type AppScreen =
  | { name: "login" }
  | { name: "character-select"; userData: UserData; initialCharacter: string }
  | { name: "chat"; userData: UserData; identity: string }

type UserData = LoginSuccessData

const storedIdentity = (account: string) =>
  createStoredValue(`${account}:identity`, v.string)

function App() {
  const [screen, setScreen] = useState<AppScreen>({ name: "login" })

  switch (screen.name) {
    case "login": {
      const handleLoginSuccess = async (userData: LoginSuccessData) => {
        const identity = await storedIdentity(userData.account)
          .get()
          .catch((error) => {
            console.warn("could not load stored identity", error)
          })

        const defaultIdentity = userData.characters[0]

        setScreen({
          name: "character-select",
          userData,
          initialCharacter: identity || defaultIdentity,
        })
      }

      return <Login onSuccess={handleLoginSuccess} />
    }

    case "character-select": {
      const handleCharacterSubmit = (identity: string) => {
        storedIdentity(screen.userData.account).set(identity)
        setScreen({ name: "chat", userData: screen.userData, identity })
      }

      return (
        <CharacterSelect
          characters={screen.userData.characters}
          initialCharacter={screen.initialCharacter}
          onSubmit={handleCharacterSubmit}
          onReturnToLogin={() => setScreen({ name: "login" })}
        />
      )
    }

    case "chat":
      return (
        <RecoilRoot>
          <ChatContainer
            account={screen.userData.account}
            ticket={screen.userData.ticket}
            identity={screen.identity}
          >
            <Chat onDisconnect={() => setScreen({ name: "login" })} />
          </ChatContainer>
        </RecoilRoot>
      )
  }
}

export default App
