import { action, observable } from "mobx"

export type InputStateType<M extends InputState> = M extends InputState<infer T>
  ? T
  : never

export class InputState<T = unknown> {
  constructor(initialValue: T) {
    this.value = this.initialValue = initialValue
  }

  readonly initialValue: T
  @observable.ref value: T

  @action set = (value: T) => {
    this.value = value
  }

  @action reset = () => {
    this.value = this.initialValue
  }
}
