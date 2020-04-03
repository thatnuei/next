import { computed, observable } from "mobx"
import { MessageModel } from "./MessageModel"

export class MessageListModel {
  @observable.shallow
  private _messages: MessageModel[] = []

  @computed
  get items(): readonly MessageModel[] {
    return this._messages
  }

  add(...args: ConstructorParameters<typeof MessageModel>) {
    const message = new MessageModel(...args)
    this._messages = [...this._messages.slice(-300), message]
  }
}
