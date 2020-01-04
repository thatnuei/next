import { Channel } from "./types"

export function createChannel(id: string): Channel {
  return {
    id,
    name: id,
    description: "",
    mode: "both",
    selectedMode: "both",
    users: new Set(),
    ops: new Set(),
    messages: [],
    input: "",
    unread: false,
  }
}
