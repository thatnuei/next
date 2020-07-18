import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
} from "recoil"
import { useChatCredentials } from "../chat/credentialsContext"
import {
  createChannelMessage,
  MessageState,
  MessageType,
} from "../message/MessageState"
import { useSocket } from "../socket/socketContext"
import { ChannelMode } from "./types"

export type ChannelState = {
  id: string
  title: string
  description: string
  mode: ChannelMode
  selectedMode: ChannelMode
  isUnread: boolean
  users: string[]
  ops: string[]
  chatInput: string
}

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

export const isPresentInChannelSelector = selectorFamily({
  key: "isPresentInChannel",
  get: (channelId: string) => ({ get }) =>
    get(joinedChannelIdsAtom).includes(channelId),
})

export function useJoinedChannelIds() {
  return useRecoilValue(joinedChannelIdsAtom)
}

export function useJoinChannelAction() {
  const socket = useSocket()

  return useRecoilCallback(
    ({ set, snapshot }) => async (id: string, title?: string) => {
      const isPresent = await snapshot.getPromise(
        isPresentInChannelSelector(id),
      )
      if (isPresent) return

      set(channelAtom(id), (prev) => ({
        ...prev,
        title: title ?? prev.title,
      }))
      socket.send({ type: "JCH", params: { channel: id } })
    },
    [socket],
  )
}

export function useLeaveChannelAction() {
  const socket = useSocket()

  return useRecoilCallback(
    ({ snapshot }) => async (id: string) => {
      const isPresent = await snapshot.getPromise(
        isPresentInChannelSelector(id),
      )
      if (!isPresent) return

      socket.send({ type: "LCH", params: { channel: id } })
    },
    [socket],
  )
}

export function useSendChannelMessageAction() {
  const socket = useSocket()
  const { identity } = useChatCredentials()

  return useRecoilCallback(
    ({ set }) => (channelId: string, text: string) => {
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
