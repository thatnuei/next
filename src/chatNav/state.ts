import { action, computed, observable } from "mobx"
import { useObserver } from "mobx-react-lite"
import { useChannels } from "../channel/state"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"
import { SocketHandler } from "../chat/SocketHandler"

type RoomBase = { readonly key: string; isUnread: boolean }

type Room =
  | ({ readonly type: "channel"; readonly id: string } & RoomBase)
  | ({ readonly type: "privateChat"; readonly partnerName: string } & RoomBase)

const getChannelKey = (id: string) => `channel-${id}`
const getPrivateChatKey = (name: string) => `privateChat-${name}`

export class RoomListModel {
  @observable
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

  @action
  setCurrent = (key: string) => {
    this.currentKey = key
    const room = this.find(key)
    if (room) {
      room.isUnread = false
    }
  }

  @action
  markUnread = (key: string) => {
    const room = this.find(key)
    if (room && this.currentKey !== key) {
      room.isUnread = true
    }
  }

  @computed
  get currentRoom(): Room | undefined {
    return this.currentKey ? this.find(this.currentKey) : undefined
  }

  find = (key: string) => this.rooms.find((room) => room.key === key)

  isCurrent = (key: string) => this.currentKey === key
}

export function useChatNav() {
  const { state } = useChatContext()
  const { leave } = useChannels()
  const { roomList } = state

  const currentRoom = useObserver(() => roomList.currentRoom)

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
      state.roomList.setCurrent(room.key)
      state.sideMenuOverlay.hide()
    },

    closeRoom(room: Room) {
      if (room.type === "channel") {
        leave(room.id)
      } else {
        state.roomList.remove(room.key)
      }
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
        state.roomList.add({
          type: "channel",
          id,
          key: getChannelKey(id),
          isUnread: false,
        })
      }
    },

    LCH({ character, channel }) {
      if (character === identity) {
        state.roomList.remove(getChannelKey(channel))
      }
    },

    MSG({ channel: id }) {
      const channel = state.channels.get(id)
      const key = getChannelKey(id)
      if (channel.shouldShowMessage("normal")) {
        state.roomList.markUnread(key)
      }
    },

    PRI({ character }) {
      const room: Room = {
        type: "privateChat",
        partnerName: character,
        key: getPrivateChatKey(character),
        isUnread: false,
      }
      state.roomList.add(room)
      state.roomList.markUnread(room.key)
    },
  })
}
