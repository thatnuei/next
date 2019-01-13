import { navigate } from "@reach/router"
import createContainer from "constate"
import * as idb from "idb-keyval"
import { useEffect, useState } from "react"
import useChannelStore from "../channel/useChannelStore"
import useCharacterStore from "../character/useCharacterStore"
import { OptionalArg } from "../common/types"
import { chatServerUrl } from "../fchat/constants"
import createCommandHandler from "../fchat/createCommandHandler"
import { ClientCommandMap, ServerCommand } from "../fchat/types"
import * as api from "../flist/api"
import routePaths from "./routePaths"

type UserData = {
  account: string
  ticket: string
}

const userDataKey = "user"

function useAppState() {
  const [userData, setUserData] = useState<UserData>()
  const [isSessionLoaded, setSessionLoaded] = useState(false)
  const characterStore = useCharacterStore()
  const channelStore = useChannelStore()

  useEffect(
    () => {
      if (!isSessionLoaded || !userData) return
      idb.set(userDataKey, userData)
    },
    [userData],
  )

  async function restoreSession() {
    try {
      const creds = await idb.get<UserData | undefined>(userDataKey)
      if (creds) {
        const { account, ticket } = creds
        setUserData({ account, ticket })
      }
    } catch (error) {
      throw error
    } finally {
      setSessionLoaded(true)
    }
  }

  async function submitLogin(account: string, password: string) {
    const { ticket } = await api.authenticate(account, password)
    setUserData({ account, ticket })
  }

  function sendCommand<K extends keyof ClientCommandMap>(
    socket: WebSocket,
    command: K,
    ...params: OptionalArg<ClientCommandMap[K]>
  ) {
    if (params[0]) {
      socket.send(`${command} ${JSON.stringify(params[0])}`)
    } else {
      socket.send(command)
    }
  }

  function connectToChat(account: string, ticket: string, character: string) {
    const socket = new WebSocket(chatServerUrl)

    const handleCommand = createCommandHandler({
      IDN() {
        sendCommand(socket, "JCH", { channel: "Frontpage" })
        sendCommand(socket, "JCH", { channel: "Fantasy" })
        sendCommand(socket, "JCH", { channel: "Story Driven LFRP" })
        sendCommand(socket, "JCH", { channel: "Development" })
      },

      PIN() {
        sendCommand(socket, "PIN")
      },

      HLO({ message }) {
        console.info(message)
      },

      CON({ count }) {
        console.info(`There are ${count} characters in chat`)
      },
    })

    socket.onopen = () => {
      sendCommand(socket, "IDN", {
        account,
        ticket,
        character,
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

      if (handleCommand(command)) return
      if (characterStore.handleCommand(command)) return
      if (channelStore.handleCommand(command)) return

      console.log("unhandled command", command)
    }

    return () => {
      socket.onopen = null
      socket.onclose = null
      socket.onmessage = null
      socket.close()
    }
  }

  return {
    isSessionLoaded,
    user: userData,
    restoreSession,
    submitLogin,
    connectToChat,
  }
}

const AppStore = createContainer(useAppState)
export default AppStore
