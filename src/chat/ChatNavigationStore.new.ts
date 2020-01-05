import { uniqBy } from "lodash"
import { computed, observable } from "mobx"
import { ChannelRoomModel } from "../channel/ChannelRoomModel"
import { ChannelStore } from "../channel/ChannelStore.new"
import { reject } from "../common/helpers/reject"
import { PrivateChatRoomModel } from "../private-chat/PrivateChatRoomModel"
import { PrivateChatStore } from "../private-chat/PrivateChatStore.new"
import { createCommandHandler } from "./helpers"
import { RoomModel } from "./RoomModel.new"

export class ChatNavigationStore {
  constructor(
    private readonly identity: string,
    private readonly channelStore: ChannelStore,
    private readonly privateChatStore: PrivateChatStore,
  ) {}

  @observable
  private currentRoomId?: string

  @observable
  rooms: RoomModel[] = []

  @computed
  get currentRoom(): RoomModel | undefined {
    return (
      this.rooms.find((it) => it.roomId === this.currentRoomId) ?? this.rooms[0]
    )
  }

  private addRoom = (room: RoomModel) => {
    this.rooms = uniqBy([...this.rooms, room], (it) => it.roomId)
  }

  removeRoom = (id: string) => {
    this.rooms = reject(this.rooms, (it) => it.roomId === id)
  }

  setCurrentRoomId = (id: string) => {
    this.currentRoomId = id
  }

  openPrivateChat = (partnerName: string) => {
    this.addRoom(
      new PrivateChatRoomModel(this, this.privateChatStore.get(partnerName)),
    )
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
        this.addRoom(
          new ChannelRoomModel(
            this,
            this.channelStore.get(channelId),
            this.channelStore,
          ),
        )
      }
    },

    LCH: ({ character: identity, channel }) => {
      if (identity === this.identity) {
        this.removeRoom(ChannelRoomModel.createId(channel))
      }
    },

    PRI: ({ character: partnerName }) => {
      this.openPrivateChat(partnerName)
    },
  })
}
