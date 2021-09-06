import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import type { Channel } from "./types"

export function useJoinedChannels(): readonly Channel[] {
  const context = useChatContext()
  return useStoreValue(context.channelStore.selectJoinedChannels())
}
