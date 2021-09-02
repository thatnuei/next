import { useChatContext } from "../chat/ChatContext"
import { useStoreKeys } from "../state/store"
import type { Channel } from "./types"

export function useChannelKeys<Key extends keyof Channel>(
  id: string,
  keys: Key[],
): Pick<Channel, Key> {
  const context = useChatContext()
  return useStoreKeys(context.channelStore.channels.selectItem(id), keys)
}
