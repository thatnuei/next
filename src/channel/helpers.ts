import { observable } from "mobx"
import { Channel } from "./types"

export function createChannel(id: string): Channel {
  return observable<Channel>({
    id,
    name: id,
    description: "",
    mode: "both",
    selectedMode: "both",
    users: new Set<string>(),
    ops: new Set<string>(),
    messages: [],
    input: "",
    unread: false,
  })
}
