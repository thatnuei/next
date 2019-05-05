import { action, observable } from "mobx"

export default class OverlayViewModel {
  @observable
  isVisible = false

  @action
  open = () => {
    this.isVisible = true
  }

  @action
  close = () => {
    this.isVisible = false
  }

  @action
  toggle = () => {
    this.isVisible = !this.isVisible
  }
}
