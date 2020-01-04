import React, { useEffect, useMemo } from "react"
import { ChatStore } from "../ChatStore.new"
import { SocketStore } from "../SocketStore.new"

type Props = {
  account: string
  ticket: string
  identity: string
}

function Chat({ account, ticket, identity }: Props) {
  const socketStore = useMemo(() => new SocketStore(), [])
  const chatStore = useMemo(() => new ChatStore(), [])

  useEffect(() => {
    return socketStore.connect({ account, ticket, identity })
  }, [socketStore, account, identity, ticket])

  useEffect(() => {
    return socketStore.commandListeners.add(chatStore.handleSocketCommand)
  }, [chatStore.handleSocketCommand, socketStore.commandListeners])

  return <p>hi, i'm Chat</p>
}

export default Chat
