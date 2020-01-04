import { uniqBy } from "lodash"
import { computed, observable } from "mobx"
import { ChannelStore } from "../channel/ChannelStore.new"
import { Channel } from "../channel/types"
import { reject } from "../common/helpers/reject"
import { PrivateChatStore } from "../private-chat/PrivateChatStore.new"
import { PrivateChat } from "../private-chat/types"
import { createCommandHandler } from "./helpers"

type ChatRoom =
  | { roomId: string; type: "channel"; channelId: string }
  | { roomId: string; type: "privateChat"; partnerName: string }

const getChannelRoomId = (id: string) => `channel:${id}`

const getPrivateChatRoomId = (partnerName: string) =>
  `privateChat:${partnerName}`

export class ChatNavigationStore {
  constructor(
    private readonly identity: string,
    private readonly channelStore: ChannelStore,
    private readonly privateChatStore: PrivateChatStore,
  ) {}

  @observable
  private currentRoomId?: string

  @observable
  private rooms: ChatRoom[] = []

  @computed
  get currentRoom(): ChatRoom | undefined {
    return (
      this.rooms.find((it) => it.roomId === this.currentRoomId) ?? this.rooms[0]
    )
  }

  addRoom = (room: ChatRoom) => {
    this.rooms = uniqBy([...this.rooms, room], (it) => it.roomId)
  }

  removeRoom = (id: string) => {
    this.rooms = reject(this.rooms, (it) => it.roomId === id)
  }

  @computed
  get currentChannel(): Channel | undefined {
    return this.currentRoom?.type === "channel"
      ? this.channelStore.get(this.currentRoom.channelId)
      : undefined
  }

  @computed
  get currentPrivateChat(): PrivateChat | undefined {
    return this.currentRoom?.type === "privateChat"
      ? this.privateChatStore.get(this.currentRoom.partnerName)
      : undefined
  }

  openPrivateChat = (partnerName: string) => {
    this.addRoom({
      type: "privateChat",
      roomId: getPrivateChatRoomId(partnerName),
      partnerName,
    })
  }

  closePrivateChat = (partnerName: string) => {
    this.removeRoom(getPrivateChatRoomId(partnerName))
  }

  handleSocketCommand = createCommandHandler({
    JCH: ({ character: { identity }, channel: channelId }) => {
      if (identity === this.identity) {
        this.addRoom({
          type: "channel",
          roomId: getChannelRoomId(channelId),
          channelId,
        })
      }
    },

    LCH: ({ character: identity, channel }) => {
      if (identity === this.identity) {
        this.removeRoom(getChannelRoomId(channel))
      }
    },

    PRI: ({ character: partnerName }) => {
      this.addRoom({
        type: "privateChat",
        roomId: getPrivateChatRoomId(partnerName),
        partnerName,
      })
    },
  })
}
