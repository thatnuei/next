import { action, computed, observable } from "mobx"
import { MessageModel } from "./MessageModel"

export const maxMessageCount = 100

export class MessageListModel {
  @observable.shallow
  private _messages: MessageModel[] = []

  @computed
  get items(): readonly MessageModel[] {
    return this._messages
  }

  @action
  add(...args: ConstructorParameters<typeof MessageModel>) {
    const message = new MessageModel(...args)

    // -subtract 1, so the new message will add up to the set count
    // (otherwise we'd have one extra over max)
    this._messages = [...this._messages.slice(-(maxMessageCount - 1)), message]
  }
}
