import { navigate } from "@reach/router"
import createContainer from "constate"
import * as idb from "idb-keyval"
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"
import CharacterModel from "../character/CharacterModel"
import { Dictionary, Mutable, OptionalArg } from "../common/types"
import { chatServerUrl } from "../fchat/constants"
import { ClientCommands, ServerCommand } from "../fchat/types"
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
  const [characters, updateCharacters] = useImmer<Dictionary<CharacterModel>>({})

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

  function updateCharacter(
    name: string,
    update: (char: Mutable<CharacterModel>) => CharacterModel | void,
  ) {
    updateCharacters((characters) => {
      const char = characters[name] || new CharacterModel(name, "None", "offline")
      characters[name] = update(char) || char
    })
  }

  function connectToChat(account: string, ticket: string, character: string) {
    const socket = new WebSocket(chatServerUrl)

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

      switch (command.type) {
        case "IDN": {
          sendCommand(socket, "JCH", { channel: "Frontpage" })
          sendCommand(socket, "JCH", { channel: "Fantasy" })
          sendCommand(socket, "JCH", { channel: "Story Driven LFRP" })
          sendCommand(socket, "JCH", { channel: "Development" })
          break
        }

        case "PIN": {
          sendCommand(socket, "PIN")
          break
        }

        case "HLO": {
          console.info(command.params.message)
          break
        }

        case "CON": {
          console.info(`There are ${command.params.count} characters in chat`)
          break
        }

        case "LIS": {
          updateCharacters((draft) => {
            for (const args of command.params.characters) {
              draft[args[0]] = new CharacterModel(...args)
            }
          })
          break
        }

        case "NLN": {
          const { gender, identity } = command.params
          updateCharacter(identity, (char) => {
            char.gender = gender
            char.status = "online"
          })
          break
        }

        case "FLN": {
          const { character: identity } = command.params
          updateCharacter(identity, (char) => {
            char.status = "offline"
            char.statusMessage = ""
          })
          break
        }

        case "STA": {
          const { character: identity, status, statusmsg } = command.params
          updateCharacter(identity, (char) => {
            char.status = status
            char.statusMessage = statusmsg
          })
          break
        }

        default:
          console.log(command)
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
    isSessionLoaded,
    user: userData,
    restoreSession,
    submitLogin,
    connectToChat,
  }
}

const AppStore = createContainer(useAppState)
export default AppStore
