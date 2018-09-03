import { action, observable } from "mobx"

export class ToggleState {
  @observable
  enabled: boolean

  constructor(initialState: boolean) {
    this.enabled = initialState
  }

  @action.bound
  enable() {
    this.enabled = true
  }

  @action.bound
  disable() {
    this.enabled = false
  }

  @action.bound
  toggle() {
    this.enabled = !this.enabled
  }
}
