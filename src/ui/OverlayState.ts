import { observable } from "mobx"

export class OverlayState {
  @observable
  isVisible = false

  show = () => {
    this.isVisible = true
  }

  hide = () => {
    this.isVisible = false
  }

  toggle = () => {
    this.isVisible = !this.isVisible
  }
}
