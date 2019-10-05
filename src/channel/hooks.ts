import { useStore } from "../store/hooks"

export function useChannel(id: string) {
  const store = useStore()
  const channel = store.state.channel.getChannel(id)
  const isJoined = store.state.channel.isJoined(id)
  return { channel, isJoined }
}

export function useAvailableChannels() {
  const store = useStore()
  return store.state.channel.availableChannels
}

export function useJoinedChannels() {
  const store = useStore()
  return store.state.channel.joinedChannels
}
