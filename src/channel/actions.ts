import { useChatContext } from "../chat/context"

// IDEA: might be worth making a version of this which "binds" the helpers to a
// given channel id? could make things nicer
export function useChannelActions() {
  const { state, socket } = useChatContext()
  return {
    isJoined(id: string) {
      return state.channels.some((channel) => channel.id === id)
    },

    join(id: string) {
      socket.send({ type: "JCH", params: { channel: id } })
    },

    leave(id: string) {
      socket.send({ type: "LCH", params: { channel: id } })
    },
  }
}
