import { observable, Observable } from "micro-observables"
import { RoomModel } from "../chat/RoomModel"
import { ChannelMode } from "./types"

export class ChannelModel extends RoomModel {
  readonly title = observable(this.id)
  readonly description = observable("")
  readonly mode = observable<ChannelMode>("both")
  readonly selectedMode = observable<ChannelMode>("chat")
  readonly users = observable<readonly string[]>([])
  readonly ops = observable<readonly string[]>([])

  readonly actualMode = Observable.from(
    this.mode,
    this.selectedMode,
  ).transform(([mode, selectedMode]) => (mode === "both" ? selectedMode : mode))

  readonly isPublic = this.title.transform((title) => title === this.id)

  readonly linkCode = Observable.from(
    this.title,
    this.isPublic,
  ).transform(([title, isPublic]) =>
    isPublic
      ? `[channel]${this.id}[/channel]`
      : `[session=${this.id}]${title}[/session]`,
  )

  constructor(readonly id: string) {
    super()
  }
}
