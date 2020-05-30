import { atomFamily } from "recoil"
import { DeepReadonly } from "../common/types"
import { MessageState, MessageType } from "../message/MessageState"
import { ChannelJoinState, ChannelMode } from "./types"

export type ChannelState = DeepReadonly<{
  id: string
  title: string
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  joinState: ChannelJoinState
  isUnread: boolean
  users: string[]
  ops: string[]
  chatInput: string
}>

export const channelAtom = atomFamily({
  key: "channel",
  default: (id: string): ChannelState => ({
    id,
    title: id,
    description: "",
    mode: "both",
    selectedMode: "chat",
    joinState: "absent",
    isUnread: false,
    users: [], // maybe make this an atom
    ops: [],
    chatInput: "", // maybe make this an atom
  }),
})

export const channelMessagesAtom = atomFamily<MessageState[], string>({
  key: "channelMessages",
  default: [],
})

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
