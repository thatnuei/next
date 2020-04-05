import { action, computed, observable, toJS } from "mobx"
import { useObserver } from "mobx-react-lite"
import { useChannels } from "../channel/state"
import { ChatState } from "../chat/ChatState"
import { createCommandHandler } from "../chat/commandHelpers"
import { useChatContext } from "../chat/context"
import { SocketHandler } from "../chat/SocketHandler"
import { getStoredRooms, StoredRoomList } from "./storage"

type RoomBase = { readonly key: string; isUnread: boolean }

type Room =
  | ({ readonly type: "channel"; readonly id: string } & RoomBase)
  | ({ readonly type: "privateChat"; readonly partnerName: string } & RoomBase)

const getChannelKey = (id: string) => `channel-${id}`
const getPrivateChatKey = (name: string) => `privateChat-${name}`

async function loadSavedRoomData(account: string, identity: string) {
  const data: StoredRoomList = await getStoredRooms(account)
    .get()
    .catch((error) => {
      console.warn(`couldn't load rooms:`, error)
      return { characters: {} }
    })

  return data.characters[identity]
}

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
    if (room) room.isUnread = false
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

  save = async (account: string, identity: string) => {
    const storage = getStoredRooms(account)

    const data: StoredRoomList = await storage.get().catch((error) => {
      console.warn(`couldn't load rooms:`, error)
      return { characters: {} }
    })

    data.characters[identity] = {
      rooms: toJS(this.rooms),
      currentKey: this.currentKey,
    }

    await storage.set(data)
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
  socket: SocketHandler,
  account: string,
  identity: string,
) {
  return createCommandHandler({
    async IDN() {
      const data = await loadSavedRoomData(account, identity)

      for (const room of data?.rooms || []) {
        if (room.type === "channel") {
          socket.send({ type: "JCH", params: { channel: room.id } })
        } else {
          state.roomList.add({
            type: "privateChat",
            partnerName: room.partnerName,
            key: getPrivateChatKey(room.partnerName),
            isUnread: false,
          })
        }
      }

      if (data?.currentKey) {
        state.roomList.setCurrent(data.currentKey)
      }
    },

    JCH({ character, channel: id }) {
      if (character.identity === identity) {
        state.roomList.add({
          type: "channel",
          id,
          key: getChannelKey(id),
          isUnread: false,
        })
        state.roomList.save(account, identity)
      }
    },

    LCH({ character, channel }) {
      if (character === identity) {
        state.roomList.remove(getChannelKey(channel))
        state.roomList.save(account, identity)
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
      state.roomList.save(account, identity)
      state.roomList.markUnread(room.key)
    },
  })
}
