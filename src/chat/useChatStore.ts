import { useEffect, useMemo } from "react"
import { ChatStore } from "./ChatStore"
import { SocketHandler } from "./SocketHandler"

export function useChatStore({
  account,
  ticket,
  identity,
}: {
  account: string
  ticket: string
  identity: string
}) {
  const socket = useMemo(() => new SocketHandler(), [])

  const store = useMemo(() => new ChatStore(identity, socket), [
    identity,
    socket,
  ])

  useEffect(() => {
    socket.listener = (command) => store.handleSocketCommand(command)
    socket.connect({ account, ticket, identity })
    return () => socket.disconnect()
  }, [socket, account, ticket, identity, store])

  return store
}
