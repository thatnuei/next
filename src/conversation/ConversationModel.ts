import { MessageModel } from "../message/MessageModel"

// TODO: make this an abstract class later https://github.com/babel/babel/issues/8172
export interface ConversationModel {
  readonly id: string
  users?: string[]
  messages: MessageModel[]
  filteredMessages?: MessageModel[]
}
