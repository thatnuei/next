import { eq } from "lodash/fp"
import { observable, Observable } from "micro-observables"
import { MessageState } from "../message/MessageState"
import { ChannelMode } from "./types"

export class ChannelModel {
  readonly title = observable(this.id)
  readonly description = observable("")
  readonly mode = observable<ChannelMode>("both")
  readonly selectedMode = observable<ChannelMode>("chat")
  readonly isUnread = observable(false)
  readonly users = observable<readonly string[]>([])
  readonly ops = observable<readonly string[]>([])
  readonly chatInput = observable("")

  private readonly _messages = observable<readonly MessageState[]>([])
  readonly messages = this._messages.readOnly()

  readonly actualMode = Observable.from(
    this.mode,
    this.selectedMode,
  ).transform(([mode, selectedMode]) => (mode === "both" ? selectedMode : mode))

  readonly isPublic = this.title.transform(eq(this.id))

  readonly linkCode = Observable.from(
    this.title,
    this.isPublic,
  ).transform(([title, isPublic]) =>
    isPublic
      ? `[channel]${this.id}[/channel]`
      : `[session=${this.id}]${title}[/session]`,
  )

  constructor(readonly id: string) {}

  addMessage = (message: MessageState) => {
    this._messages.update((messages) => [...messages, message].slice(-300, 0))
  }

  clearMessages = () => {
    this._messages.set([])
  }
}
