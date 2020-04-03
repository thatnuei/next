import { computed, observable } from "mobx"
import { MessageModel } from "./MessageModel"

const maxMessageCount = 100

export class MessageListModel {
  @observable.shallow
  private _messages: MessageModel[] = []

  @computed
  get items(): readonly MessageModel[] {
    return this._messages
  }

  add(...args: ConstructorParameters<typeof MessageModel>) {
    const message = new MessageModel(...args)
    this._messages = [...this._messages.slice(-maxMessageCount), message]
  }
}
