import { observable } from "mobx"

export class OverlayModel {
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
