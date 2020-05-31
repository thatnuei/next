import { useCallback } from "react"
import { atom, atomFamily, useRecoilValue } from "recoil"
import { DeepReadonly } from "../helpers/common/types"
import { MessageState, MessageType } from "../message/MessageState"
import { ChannelMode } from "./types"

export type ChannelState = DeepReadonly<{
  id: string
  title: string
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
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

export const joinedChannelIdsAtom = atom<string[]>({
  key: "joinedChannelIds",
  default: [],
})

export function useJoinedChannelIds() {
  return useRecoilValue(joinedChannelIdsAtom)
}

export function useIsPresent() {
  const joinedChannelIds = useJoinedChannelIds()
  return useCallback(
    (channelId: string) => joinedChannelIds.includes(channelId),
    [joinedChannelIds],
  )
}

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
