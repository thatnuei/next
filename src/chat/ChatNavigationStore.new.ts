import { uniqBy } from "lodash"
import { computed, observable } from "mobx"
import { ChannelStore } from "../channel/ChannelStore.new"
import { reject } from "../common/helpers/reject"
import { createCommandHandler } from "./helpers"

type Room =
  | { type: "channel"; key: string; channelId: string }
  | { type: "privateChat"; key: string; partnerName: string }

const getChannelKey = (channelId: string) => `channel:${channelId}`

const getPrivateChatKey = (privateChat: string) => `privateChat:${privateChat}`

export class ChatNavigationStore {
  constructor(
    private readonly identity: string,
    private readonly channelStore: ChannelStore,
  ) {}

  @observable
  private currentRoomKey?: string

  @observable
  rooms: Room[] = []

  @computed
  get currentRoom(): Room | undefined {
    return (
      this.rooms.find((it) => it.key === this.currentRoomKey) ?? this.rooms[0]
    )
  }

  private addRoom = (room: Room) => {
    this.rooms = uniqBy([...this.rooms, room], (it) => it.key)
  }

  private removeRoom = (key: string) => {
    this.rooms = reject(this.rooms, (it) => it.key === key)
  }

  setCurrentRoomKey = (key: string) => {
    this.currentRoomKey = key
  }

  isActive = (roomKey: string) => this.currentRoomKey === roomKey

  openPrivateChat = (partnerName: string) => {
    this.addRoom({
      type: "privateChat",
      key: getPrivateChatKey(partnerName),
      partnerName,
    })
  }

  closePrivateChat = (partnerName: string) => {
    this.removeRoom(getPrivateChatKey(partnerName))
  }

  handleSocketCommand = createCommandHandler({
    IDN: () => {
      this.channelStore.join("Frontpage")
      this.channelStore.join("Story Driven LFRP")
      this.channelStore.join("Fantasy")
      this.channelStore.join("RP Bar")
      this.channelStore.join("RP Dark City")
      this.channelStore.join("Development")
    },

    JCH: ({ character: { identity }, channel: channelId }) => {
      if (identity === this.identity) {
        this.addRoom({
          type: "channel",
          key: getChannelKey(channelId),
          channelId,
        })
      }
    },

    LCH: ({ character: identity, channel }) => {
      if (identity === this.identity) {
        this.removeRoom(getChannelKey(channel))
      }
    },

    PRI: ({ character: partnerName }) => {
      this.openPrivateChat(partnerName)
    },
  })
}
