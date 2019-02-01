import * as idb from "idb-keyval"
import React, { useEffect, useState } from "react"
import ChatRoute from "../chat/ChatRoute"
import ChatStore from "../chat/ChatStore"
import * as api from "../flist/api"
import { Redirect, Route, Switch, useRouter } from "../router"
import CharacterSelectRoute from "./CharacterSelectRoute"
import LoginRoute from "./LoginRoute"
import routePaths from "./routePaths"

type UserData = {
  account: string
  ticket: string
}

const userDataKey = "user"
const identityKey = (account: string) => `identity:${account}`

function App() {
  const { history } = useRouter()
  const [isSessionLoaded, setSessionLoaded] = useState(false)
  const [userData, setUserData] = useState<UserData>()
  const [userCharacters, setUserCharacters] = useState<string[]>()
  const [identity, setIdentity] = useState<string>()

  useEffect(() => {
    restoreSession()
  }, [])

  useEffect(() => {
    if (!isSessionLoaded || !userData) return
    idb.set(userDataKey, userData)

    if (!identity) return
    window.sessionStorage.setItem(identityKey(userData.account), identity)
  }, [userData, identity])

  function updateSessionData(
    account: string,
    ticket: string,
    characters: string[],
  ) {
    const newIdentity = window.sessionStorage.getItem(identityKey(account))

    setUserData({ account, ticket })
    setUserCharacters(characters)
    setIdentity(newIdentity || characters[0])
  }

  async function restoreSession() {
    try {
      const creds = await idb.get<UserData | undefined>(userDataKey)
      if (!creds) throw new Error("Credentials not found in storage")

      const { account, ticket } = creds
      const { characters } = await api.fetchCharacters(account, ticket)
      updateSessionData(account, ticket, characters)
    } catch (error) {
      console.warn("Session restore error:", error)
    }

    setSessionLoaded(true)
  }

  async function handleLoginSubmit(account: string, password: string) {
    try {
      const { ticket, characters } = await api.authenticate(account, password)
      updateSessionData(account, ticket, characters)
      history.push(routePaths.characterSelect)
    } catch (error) {
      alert(error)
    }
  }

  function handleIdentitySubmit() {
    history.push(routePaths.chat)
  }

  function renderChat() {
    if (!userData) return <Redirect to={routePaths.login} />
    if (!identity) return <Redirect to={routePaths.characterSelect} />
    return (
      <ChatStore.Provider {...userData} identity={identity}>
        <ChatRoute {...userData} identity={identity} />
      </ChatStore.Provider>
    )
  }

  if (!isSessionLoaded) {
    return <p>Setting things up...</p>
  }

  return (
    <Switch>
      <Route path={routePaths.login}>
        <LoginRoute onLoginSubmit={handleLoginSubmit} />
      </Route>

      <Route path={routePaths.characterSelect}>
        <CharacterSelectRoute
          characters={userCharacters || []}
          identity={identity || (userCharacters || [])[0] || ""}
          onIdentityChange={setIdentity}
          onSubmit={handleIdentitySubmit}
        />
      </Route>

      <Route partial path={routePaths.chat} render={renderChat} />

      <Redirect
        from="/"
        to={userData ? routePaths.characterSelect : routePaths.login}
      />
    </Switch>
  )
}

export default App
