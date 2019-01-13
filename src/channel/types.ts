import * as fchat from "fchat"
import { Dictionary } from "../common/types"
import { Message } from "../message/types"

export type ChannelMode = fchat.Channel.Mode

export type Channel = {
  id: string
  name: string
  description: string
  mode: ChannelMode
  users: Dictionary<true>
  ops: Dictionary<true>
  messages: Message[]
}
