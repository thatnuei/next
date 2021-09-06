import type { TruthyMap } from "../common/types"
import type { RoomState } from "../room/state"

export type ChannelMode = "both" | "chat" | "ads"
export type ChannelJoinState = "absent" | "joining" | "present" | "leaving"

export type Channel = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly mode: ChannelMode
  readonly selectedMode: ChannelMode
  readonly users: TruthyMap
  readonly ops: TruthyMap
  readonly joinState: ChannelJoinState
} & RoomState
