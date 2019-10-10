import { action, computed, observable } from "mobx"

export default class OverlayState {
  @observable
  visible = false

  @action
  show = () => {
    this.visible = true
  }

  @action
  hide = () => {
    this.visible = false
  }

  @action
  toggle = () => {
    this.visible = !this.visible
  }

  @computed
  get overlayProps() {
    return {
      visible: this.visible,
      onClose: this.hide,
    }
  }
}
