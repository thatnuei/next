import { action, observable } from "mobx"
import ChannelModel from "../channel/ChannelModel"
import { Values } from "../common/types"
import { Position } from "../ui/types"

type OverlayMap = {
  channelBrowser: void
  channelMenu: { channel: ChannelModel }
  primaryNavigation: void
  updateStatus: void
  characterMenu: { name: string; position: Position }
}

export type Overlay = Values<
  {
    [K in keyof OverlayMap]: OverlayMap[K] extends object
      ? { type: K; params: OverlayMap[K] }
      : { type: K }
  }
>

export default class OverlayStore {
  @observable.ref
  overlays: Overlay[] = []

  @action
  open = (overlay: Overlay) => {
    this.overlays = [...this.overlays, overlay]
  }

  @action
  close = (type: keyof OverlayMap) => {
    this.overlays = this.overlays.filter((overlay) => overlay.type !== type)
  }
}
