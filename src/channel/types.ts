import { Message } from "../message/types"

export type Channel = {
  id: string
  title: string
  description: string
  messages: Message[]
  users: string[]
}

export function createChannel(id: string): Channel {
  return {
    id,
    title: id,
    description: "",
    messages: [],
    users: [],
  }
}
