import { action, observable } from "mobx"
import { useObserver } from "mobx-react-lite"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"
import { SocketHandler } from "../chat/SocketHandler"

type Room =
  | { key: string; type: "channel"; id: string }
  | { key: string; type: "privateChat"; partnerName: string }

const getChannelKey = (id: string) => `channel-${id}`
const getPrivateChatKey = (name: string) => `privateChat-${name}`

export class RoomListModel {
  @observable.shallow
  rooms: Room[] = []

  @observable.ref
  currentKey?: string

  @action
  add = (room: Room) => {
    if (this.find(room.key)) return
    this.rooms.push(room)
  }

  @action
  remove = (key: string) => {
    this.rooms = this.rooms.filter((it) => it.key !== key)
  }

  find = (key: string) => this.rooms.find((room) => room.key === key)
}

export function useChatNav() {
  const { state } = useChatContext()
  const { roomList } = state

  const currentRoom = useObserver(() =>
    roomList.currentKey ? roomList.find(roomList.currentKey) : undefined,
  )

  const currentChannel = useObserver(() =>
    currentRoom?.type === "channel"
      ? state.channels.get(currentRoom.id)
      : undefined,
  )

  const currentPrivateChat = useObserver(() =>
    currentRoom?.type === "privateChat"
      ? state.privateChats.get(currentRoom.partnerName)
      : undefined,
  )

  return {
    currentRoom,
    currentChannel,
    currentPrivateChat,
    setRoom(room: Room) {
      state.roomList.currentKey = room.key
      state.sideMenuOverlay.hide()
    },
  }
}

export function createChatNavCommandHandler(
  state: ChatState,
  identity: string,
  socket: SocketHandler,
) {
  return createCommandHandler({
    IDN() {
      socket.send({ type: "JCH", params: { channel: "Frontpage" } })
      socket.send({ type: "JCH", params: { channel: "Fantasy" } })
      socket.send({
        type: "JCH",
        params: { channel: "Story Driven LFRP" },
      })
      socket.send({ type: "JCH", params: { channel: "Development" } })
    },

    JCH({ character, channel: id }) {
      if (character.identity === identity) {
        state.roomList.add({ type: "channel", id, key: getChannelKey(id) })
      }
    },

    LCH({ character, channel }) {
      if (character === identity) {
        state.roomList.remove(getChannelKey(channel))
      }
    },

    PRI({ character }) {
      state.roomList.add({
        type: "privateChat",
        partnerName: character,
        key: getPrivateChatKey(character),
      })
    },
  })
}
