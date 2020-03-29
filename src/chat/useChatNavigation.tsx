import { useObserver } from "mobx-react-lite"
import { useState } from "react"
import { useChatContext } from "./context"

type Room =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export function useChatNavigation() {
  const { channelStore } = useChatContext()

  const [_room, setRoom] = useState<Room>()

  return useObserver(() => {
    const firstChannel =
      channelStore.channels.length > 0 ? channelStore.channels[0] : undefined

    const room =
      _room ||
      (firstChannel && {
        type: "channel",
        id: firstChannel.id,
      })

    const activeChannel =
      room?.type === "channel" &&
      channelStore.channels.find((it) => it.id === room.id)

    return { activeChannel, setRoom }
  })
}
