import { observable } from "mobx"
import { useChatContext } from "../chat/context"

type Room =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export class ChatNavState {
  @observable.ref
  currentRoom: Room | undefined
}

export function useNavState() {
  const { state } = useChatContext()

  const firstChannel = state.channels.length > 0 ? state.channels[0] : undefined

  const currentRoom =
    state.nav.currentRoom ||
    (firstChannel && { type: "channel", id: firstChannel.id })

  const currentChannel =
    currentRoom?.type === "channel"
      ? state.channels.find((ch) => ch.id === currentRoom.id)
      : undefined

  return { currentRoom, currentChannel }
}

export function useNavActions() {
  const { state } = useChatContext()

  return {
    setRoom(room: Room) {
      state.nav.currentRoom = room
    },
  }
}
