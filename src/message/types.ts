export type Message = {
  id: string
  time: number
  senderName: string | undefined
  text: string
  type: MessageType
}

export type MessageType = "chat" | "lfrp" | "admin" | "system"
