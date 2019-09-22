import { Dictionary } from "../../common/types"
import { Channel } from "./types"

export type ChannelStoreState = {
  channels: Dictionary<Channel>
}

export const state: ChannelStoreState = {
  channels: {},
}
