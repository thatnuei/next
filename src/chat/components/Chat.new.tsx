import React, { useEffect, useMemo } from "react"
import { SocketStore } from "../SocketStore.new"

type Props = {
  account: string
  ticket: string
  identity: string
}

function Chat({ account, ticket, identity }: Props) {
  const socketStore = useMemo(() => new SocketStore(), [])

  // prettier-ignore
  useEffect(
    () => socketStore.connect({ account, ticket, identity }),
    [socketStore, account, identity, ticket],
  )

  return <p>hi, i'm Chat</p>
}

export default Chat
