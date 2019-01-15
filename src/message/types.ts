export type MessageType = "chat" | "lfrp" | "admin" | "system"

export type Message = {
  type: MessageType
  sender?: string
  text: string
  time: number
}
