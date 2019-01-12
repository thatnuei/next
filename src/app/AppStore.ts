import { navigate } from "@reach/router"
import createContainer from "constate"
import * as idb from "idb-keyval"
import { useContext, useEffect, useState } from "react"
import { useImmer } from "use-immer"
import CharacterModel from "../character/CharacterModel"
import { chatServerUrl } from "../fchat/constants"
import { ClientCommands, ServerCommand } from "../fchat/types"
import * as api from "../flist/api"
import { Dictionary, OptionalArg } from "../helpers/types"
import routePaths from "./routePaths"

type UserData = {
  account: string
  ticket: string
  characters: string[]
}

const userDataKey = "user"
const identityKey = (account: string) => `${account}:identity`

function useAppState() {
  const [userData, setUserData] = useState<UserData>()
  const [identity, setIdentity] = useState("")
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [characters, updateCharacters] = useImmer<Dictionary<CharacterModel>>({})

  useEffect(
    () => {
      if (!sessionLoaded) return
      if (!userData) return
      idb.set(userDataKey, userData)
      idb.set(identityKey(userData.account), identity)
    },
    [userData, identity],
  )

  async function restoreIdentity() {
    if (!userData) return

    const { account, characters } = userData
    const loadedIdentity = await idb.get<string | undefined>(identityKey(account))

    setIdentity(loadedIdentity || characters[0])
  }

  async function restoreSession() {
    const creds = await idb.get<UserData | undefined>(userDataKey)
    if (creds) {
      const { account, ticket } = creds
      const { characters } = await api.fetchCharacters(account, ticket)
      setUserData({ account, ticket, characters })
    }

    setSessionLoaded(true)
  }

  async function submitLogin(account: string, password: string) {
    const { ticket, characters } = await api.authenticate(account, password)
    setUserData({ account, ticket, characters })
  }

  function sendCommand<K extends keyof ClientCommands>(
    socket: WebSocket,
    command: K,
    ...params: OptionalArg<ClientCommands[K]>
  ) {
    if (params[0]) {
      socket.send(`${command} ${JSON.stringify(params[0])}`)
    } else {
      socket.send(command)
    }
  }

  function connectToChat() {
    if (!identity) {
      navigate(routePaths.characterSelect)
      return
    }

    if (!userData) {
      navigate(routePaths.login)
      return
    }

    const socket = new WebSocket(chatServerUrl)

    socket.onopen = () => {
      sendCommand(socket, "IDN", {
        account: userData.account,
        ticket: userData.ticket,
        character: identity,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      console.log("socket closed")
      navigate(routePaths.login)
    }

    socket.onmessage = ({ data }) => {
      const type = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      const command: ServerCommand = { type, params }

      console.log(command)

      if (command.type === "PIN") {
        sendCommand(socket, "PIN")
      }

      if (command.type === "HLO") {
        console.info(command.params.message)
      }

      if (command.type === "CON") {
        console.info(`There are ${command.params.count} characters in chat`)
      }

      if (command.type === "LIS") {
        updateCharacters((draft) => {
          for (const args of command.params.characters) {
            draft[args[0]] = new CharacterModel(...args)
          }
        })
      }
    }

    return () => {
      socket.onopen = null
      socket.onclose = null
      socket.onmessage = null
      socket.close()
    }
  }

  return {
    user: userData,
    identity,
    setIdentity,
    restoreSession,
    restoreIdentity,
    submitLogin,
    connectToChat,
  }
}

const AppStore = createContainer(useAppState)
export default AppStore

export function useAppStateContext() {
  return useContext(AppStore.Context)
}
