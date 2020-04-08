import React, { useState } from "react"
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
      const handleLoginSuccess = (userData: LoginSuccessData) => {
        const defaultIdentity = userData.characters[0]

        storedIdentity(userData.account)
          .get()
          .then((identity) => identity || defaultIdentity)
          .catch((error) => {
            console.warn("error loading stored identity", error)
            return defaultIdentity
          })
          .then((initialCharacter) => {
            setScreen({
              name: "character-select",
              userData,
              initialCharacter,
            })
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
        <ChatContainer
          account={screen.userData.account}
          ticket={screen.userData.ticket}
          identity={screen.identity}
        >
          <Chat onDisconnect={() => setScreen({ name: "login" })} />
        </ChatContainer>
      )
  }
}

export default App
