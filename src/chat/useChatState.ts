import { useEffect } from "react"
import routePaths from "../app/routePaths"
import useChannelStore from "../channel/useChannelStore"
import useCharacterStore from "../character/useCharacterStore"
import { OptionalArg } from "../common/types"
import { chatServerUrl } from "../fchat/constants"
import createCommandHandler from "../fchat/createCommandHandler"
import { ClientCommandMap, ServerCommand } from "../fchat/types"
import { Message, MessageWithSender } from "../message/types"
import { useRouter } from "../router"

type UserCredentials = {
  account: string
  ticket: string
  identity: string
}

function useChatState(user: UserCredentials) {
  const { history } = useRouter()
  const characterStore = useCharacterStore()
  const channelStore = useChannelStore(user.identity)

  function getChannelMessages(channelId: string): MessageWithSender[] {
    return channelStore.channels
      .get(channelId)
      .messages.map(resolveMessageSender)
  }

  function resolveMessageSender(message: Message): MessageWithSender {
    const sender = message.senderName
      ? characterStore.characters.get(message.senderName)
      : undefined

    return message.senderName ? { ...message, sender: sender } : message
  }

  useEffect(() => {
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
        account: user.account,
        ticket: user.ticket,
        character: user.identity,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      console.log("socket closed")
      history.push(routePaths.login)
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
  }, [])

  return { channelStore, characterStore, getChannelMessages }
}
export default useChatState

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
