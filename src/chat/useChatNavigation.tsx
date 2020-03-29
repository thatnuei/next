import { useObserver } from "mobx-react-lite"
import { useState } from "react"
import { ChatStore } from "./ChatStore"

type Room =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export function useChatNavigation(store: ChatStore) {
  const [_room, setRoom] = useState<Room>()

  return useObserver(() => {
    const firstChannel =
      store.channels.length > 0 ? store.channels[0] : undefined

    const room =
      _room ||
      (firstChannel && {
        type: "channel",
        id: firstChannel.id,
      })

    const activeChannel =
      room?.type === "channel" && store.channels.find((it) => it.id === room.id)

    return { activeChannel, setRoom }
  })
}
