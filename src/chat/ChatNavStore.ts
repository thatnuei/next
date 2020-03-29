import { computed, observable } from "mobx"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelStore } from "../channel/ChannelStore"

type Room =
  | { type: "channel"; id: string }
  | { type: "privateChat"; partnerName: string }

export class ChatNavStore {
  constructor(private channelStore: ChannelStore) {}

  @observable
  private currentRoomRaw: Room | undefined

  @computed
  get currentRoom(): Room | undefined {
    const { channels } = this.channelStore
    const firstChannel = channels.length > 0 ? channels[0] : undefined

    return (
      this.currentRoomRaw ||
      (firstChannel && { type: "channel", id: firstChannel.id })
    )
  }

  @computed
  get currentChannel(): ChannelModel | undefined {
    const room = this.currentRoom
    return room?.type === "channel"
      ? this.channelStore.channels.find((it) => it.id === room.id)
      : undefined
  }

  setRoom(room: Room) {
    this.currentRoomRaw = room
  }
}
