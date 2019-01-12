export type MessageType = "normal" | "ad" | "admin"

export type MessageModelOptions = Pick<MessageModel, "sender" | "text" | "type"> & {
  timestamp?: number
}

export class MessageModel {
  id = String(Math.random())
  sender?: string
  text: string
  type: MessageType
  timestamp: number
  localeTimeString: string

  constructor(options: MessageModelOptions) {
    this.sender = options.sender
    this.text = options.text
    this.type = options.type
    this.timestamp = options.timestamp || Date.now()
    this.localeTimeString = new Date(this.timestamp).toLocaleTimeString()
  }
}
