import { useCallback } from "react"
import { atom, atomFamily, useRecoilCallback, useRecoilValue } from "recoil"
import { useChatCredentials } from "../chat/credentialsContext"
import { DeepReadonly } from "../helpers/common/types"
import {
  createChannelMessage,
  MessageState,
  MessageType,
} from "../message/MessageState"
import { useSocket } from "../socket/socketContext"
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

export function useJoinChannelAction() {
  const socket = useSocket()
  const isPresent = useIsPresent()

  return useRecoilCallback(
    ({ set }, id: string, title?: string) => {
      if (isPresent(id)) return
      set(
        channelAtom(id),
        (prev): ChannelState => ({
          ...prev,
          title: title ?? prev.title,
        }),
      )
      socket.send({ type: "JCH", params: { channel: id } })
    },
    [isPresent, socket],
  )
}

export function useLeaveChannelAction() {
  const socket = useSocket()
  const isPresent = useIsPresent()

  return useCallback(
    (id: string) => {
      if (!isPresent(id)) return
      socket.send({ type: "LCH", params: { channel: id } })
    },
    [isPresent, socket],
  )
}

export function useSendChannelMessageAction() {
  const socket = useSocket()
  const { identity } = useChatCredentials()

  return useRecoilCallback(
    ({ set }, channelId: string, text: string) => {
      set(channelMessagesAtom(channelId), (prev) => [
        ...prev,
        createChannelMessage(identity, text),
      ])
      socket.send({
        type: "MSG",
        params: { channel: channelId, message: text },
      })
    },
    [identity, socket],
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
