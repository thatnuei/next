import { action, observable } from "mobx"

export type Overlay = {
  render: (props: { visible: boolean; onClose: () => void }) => void
  key: string
}

export default class OverlayStore {
  @observable.ref
  overlays: Overlay[] = []

  @action
  open = (overlay: Overlay) => {
    this.overlays = [...this.overlays, overlay]
  }

  @action
  close = (key: string) => {
    this.overlays = this.overlays.filter((overlay) => overlay.key !== key)
  }
}
