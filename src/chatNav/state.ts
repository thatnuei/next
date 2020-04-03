import { action, observable } from "mobx"
import { useObserver } from "mobx-react-lite"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"

type Room =
  | { key: string; type: "channel"; id: string }
  | { key: string; type: "privateChat"; partnerName: string }

export class RoomListModel {
  @observable.shallow
  rooms: Room[] = []

  @observable.ref
  currentKey?: string

  @action
  add(room: Room) {
    this.rooms.push(room)
  }

  @action
  remove(key: string) {
    this.rooms = this.rooms.filter((it) => it.key !== key)
  }

  find = (key: string) => this.rooms.find((room) => room.key === key)
}

export function useChatNav() {
  const { state } = useChatContext()
  const { roomList: rooms } = state

  const currentRoom = useObserver(() =>
    rooms.currentKey ? rooms.find(rooms.currentKey) : undefined,
  )

  const currentChannel = useObserver(() =>
    currentRoom?.type === "channel"
      ? state.channels.get(currentRoom.id)
      : undefined,
  )

  return {
    currentRoom,
    currentChannel,
    setRoom(room: Room) {
      state.roomList.currentKey = room.key
    },
  }
}

export function createChatNavCommandHandler(
  state: ChatState,
  identity: string,
) {
  return createCommandHandler({
    JCH({ character, channel: id }) {
      if (character.identity === identity) {
        state.roomList.add({ type: "channel", id, key: `channel-${id}` })
      }
    },

    LCH({ character, channel }) {
      if (character === identity) {
        state.roomList.remove(`channel-${channel}`)
      }
    },
  })
}
