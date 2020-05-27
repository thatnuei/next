import { atom } from "recoil"
import { memoize } from "../common/memoize"
import { MessageState, MessageType } from "../message/MessageState"
import { ChannelJoinState, ChannelMode } from "./types"

export type ChannelState = {
  id: string
  title: string
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  joinState: ChannelJoinState
  isUnread: boolean
  users: readonly string[]
  ops: readonly string[]
  chatInput: string
}

export const channelAtom = memoize((id: string) =>
  atom<ChannelState>({
    key: `channel:${id}`,
    default: {
      id,
      title: id,
      description: "",
      mode: "both",
      selectedMode: "chat",
      joinState: "absent",
      isUnread: false,
      users: [],
      ops: [],
      chatInput: "", // maybe make this an atom
    },
  }),
)

export const channelMessagesAtom = memoize((id: string) =>
  atom<MessageState[]>({
    key: `channelMessages:${id}`,
    default: [],
  }),
)

export function getActualMode(channel: ChannelState) {
  return channel.mode === "both" ? channel.selectedMode : channel.mode
}

export function getLinkCode(channel: ChannelState) {
  return channel.id === channel.title
    ? `[channel]${channel.id}[/channel]`
    : `[session=${channel.id}]${channel.title}[/session]`
}

export function shouldShowMessage(
  channel: ChannelState,
  messageType: MessageType,
) {
  const actualMode = getActualMode(channel)

  if (actualMode === "ads") {
    return messageType !== "normal" && messageType !== "action"
  }

  if (actualMode === "chat") {
    return messageType !== "lfrp"
  }

  return true
}
