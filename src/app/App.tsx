import React, { useEffect, useState } from "react"
import { Chat } from "../chat/Chat"
import { authenticate, fetchCharacters } from "../flist/api"
import { StoredValue } from "../helpers/StoredValue"
import { CharacterSelectScreen } from "./CharacterSelectScreen"
import { LoginScreen, LoginValues } from "./LoginScreen"

type AppScreen = "setup" | "login" | "characterSelect" | "chat"

type AuthCredentials = { account: string; ticket: string }

const storedCredentials = new StoredValue<AuthCredentials>("credentials")

function App() {
  const [screen, setScreen] = useState<AppScreen>("setup")
  const [characters, setCharacters] = useState<string[]>([])
  const [credentials, setCredentials] = useState<AuthCredentials>()
  const [identity, setIdentity] = useState<string>()

  function handleAuthSuccess(creds: AuthCredentials, characters: string[], newIdentity?: string) {
    setCredentials(creds)
    setCharacters(characters.sort())
    setIdentity(newIdentity)
    setScreen("characterSelect")
  }

  function getStoredIdentity(account: string) {
    return new StoredValue<string>(`${account}:identity`)
  }

  async function handleLoginSubmit({ account, password }: LoginValues) {
    try {
      const { ticket, characters } = await authenticate(account, password)
      const storedIdentity = await getStoredIdentity(account).load()

      handleAuthSuccess({ account, ticket }, characters, storedIdentity)

      storedCredentials.save({ account, ticket })
    } catch (error) {
      alert(error)
    }
  }

  async function handleCharacterSelected(identity: string) {
    setIdentity(identity)
    if (!credentials) return
    getStoredIdentity(credentials.account).save(identity)
  }

  async function showChat() {
    setScreen("chat")
  }

  async function init() {
    setScreen("setup")

    try {
      const credentials = await storedCredentials.load()
      if (!credentials) {
        throw new Error("Credentials not found in storage")
      }

      const { account, ticket } = credentials
      const { characters } = await fetchCharacters(account, ticket)
      const storedIdentity = await getStoredIdentity(account).load()

      handleAuthSuccess({ account, ticket }, characters, storedIdentity)
    } catch (error) {
      console.warn("[non-fatal]", error)
      setScreen("login")
    }
  }

  function handleDisconnect() {
    alert("Disconnected from server :(")
    init()
  }

  useEffect(() => {
    init()
  }, [])

  switch (screen) {
    case "setup":
      return <>Setting things up...</>

    case "login":
      return <LoginScreen onSubmit={handleLoginSubmit} />

    case "characterSelect":
      return (
        <CharacterSelectScreen
          characters={characters}
          selected={identity || characters[0]}
          onChange={handleCharacterSelected}
          onSubmit={showChat}
        />
      )

    case "chat": {
      if (credentials && identity) {
        return <Chat {...credentials} character={identity} onDisconnect={handleDisconnect} />
      }
    }
  }

  return <>screen not found</>
}
export default App
