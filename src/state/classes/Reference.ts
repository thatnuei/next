import { action, computed, observable } from "mobx"

export default class Reference<T> {
  @observable
  private internalValue: T

  private constructor(initialValue: T) {
    this.internalValue = initialValue
  }

  static of = <T>(initialValue: T) => new Reference(initialValue)
  static nullable = <T>(initialValue?: T) => new Reference(initialValue)

  @computed
  get value() {
    return this.internalValue
  }

  @action
  set = (newValue: T) => {
    this.internalValue = newValue
  }
}
