import { action, computed, observable } from "mobx"
import { InputState } from "../form/InputState"
import { MessageListState } from "../message/MessageListState"
import { MessageType } from "../message/MessageState"
import { ChannelJoinState, ChannelMode } from "./types"

export class ChannelState {
  constructor(public readonly id: string) {}

  @observable title = this.id
  @observable description = ""
  @observable mode: ChannelMode = "both"
  @observable selectedMode: ChannelMode = "both"
  @observable joinState: ChannelJoinState = "absent"
  @observable isUnread = false

  @observable.shallow users = new Set<string>()
  @observable.shallow ops = new Set<string>()

  messageList = new MessageListState()
  chatInput = new InputState("")

  @action
  setSelectedMode = (mode: ChannelMode) => {
    this.selectedMode = mode
  }

  /**
   * The "final" channel mode, based on the channel base mode and the selected mode.
   * If the channel's base mode is "both", we'll use the selected mode as the actual mode,
   * but if the channel has a more specific base mode, always respect the base mode
   */

  @computed
  get actualMode() {
    return this.mode === "both" ? this.selectedMode : this.mode
  }

  @computed
  get linkCode() {
    return this.id === this.title
      ? `[channel]${this.id}[/channel]`
      : `[session=${this.id}]${this.title}[/session]`
  }

  shouldShowMessage = (messageType: MessageType) => {
    if (this.actualMode === "ads") {
      return messageType !== "normal" && messageType !== "action"
    }

    if (this.actualMode === "chat") {
      return messageType !== "lfrp"
    }

    return true
  }
}
