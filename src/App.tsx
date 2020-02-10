import React, { useState } from "react"
import CharacterSelect from "./CharacterSelect"
import Login, { LoginSuccessData } from "./Login"

type AppScreen =
  | { name: "login" }
  | { name: "character-select"; userData: UserData }
  | { name: "chat"; userData: UserData; identity: string }

type UserData = LoginSuccessData & {
  initialCharacter: string
}

function App() {
  const [screen, setScreen] = useState<AppScreen>({ name: "login" })

  switch (screen.name) {
    case "login": {
      const handleLoginSuccess = (data: LoginSuccessData) => {
        setScreen({
          name: "character-select",
          userData: { ...data, initialCharacter: data.characters[0] },
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
          initialCharacter={screen.userData.initialCharacter}
          onSubmit={handleCharacterSubmit}
        />
      )
    }

    case "chat":
      return <p>{screen.identity}</p>
  }
}

export default App
