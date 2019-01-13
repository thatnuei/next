export type MessageType = "chat" | "lfrp" | "admin" | "system"

export type Message = {
  type: MessageType
  sender?: string
  message: string
  time: number
}
