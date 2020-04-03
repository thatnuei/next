import { action, observable } from "mobx"

export type InputModelType<M extends InputModel> = M extends InputModel<infer T>
  ? T
  : never

export class InputModel<T = unknown> {
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
