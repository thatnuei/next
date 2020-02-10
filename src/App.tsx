import React, { useState } from "react"
import CharacterSelect from "./CharacterSelect"
import Login, { LoginSuccessData } from "./Login"

type AppScreen =
  | { name: "login" }
  | { name: "character-select"; userData: UserData; initialCharacter: string }
  | { name: "chat"; userData: UserData; identity: string }

type UserData = LoginSuccessData

function App() {
  const [screen, setScreen] = useState<AppScreen>({ name: "login" })

  switch (screen.name) {
    case "login": {
      const handleLoginSuccess = (userData: LoginSuccessData) => {
        setScreen({
          name: "character-select",
          userData,
          initialCharacter: userData.characters[0],
        })
      }

      return <Login onSuccess={handleLoginSuccess} />
    }

    case "character-select": {
      const handleCharacterSubmit = (identity: string) => {
        setScreen({ name: "chat", userData: screen.userData, identity })
      }

      return (
        <CharacterSelect
          characters={screen.userData.characters}
          initialCharacter={screen.initialCharacter}
          onSubmit={handleCharacterSubmit}
        />
      )
    }

    case "chat":
      return <p>{screen.identity}</p>
  }
}

export default App
