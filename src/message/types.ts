export type MessageType = "chat" | "lfrp" | "admin" | "system"

export type Message = {
  id: string
  type: MessageType
  sender?: string
  text: string
  time: number
}
