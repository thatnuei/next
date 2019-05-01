import { action, observable } from "mobx"

export type OverlayInfo = {
  key: string
  content: React.ReactElement
}

export default class OverlayStore {
  @observable
  overlays: OverlayInfo[] = []

  @action
  open = (content: React.ReactElement) => {
    const key = String(Math.random())
    this.overlays.push({ content, key })
    return key
  }

  @action
  close = (key: string) => {
    this.overlays = this.overlays.filter((entry) => entry.key !== key)
  }
}
