import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import type { Character } from "./types"

/**
 * liked characters are the list of bookmarks and friends
 */
export function useLikedCharacters(): readonly Character[] {
  const context = useChatContext()
  return useStoreValue(context.characterStore.selectLikedCharacters())
}
