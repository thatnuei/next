export type MessageType = "normal" | "ad" | "admin"

export type MessageModelOptions = Pick<MessageModel, "sender" | "text" | "type">

export class MessageModel {
  sender?: string
  text: string
  type: MessageType
  timestamp = new Date()

  constructor(options: MessageModelOptions) {
    this.sender = options.sender
    this.text = options.text
    this.type = options.type
  }
}
