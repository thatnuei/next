import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import type { Character } from "./types"
import { useCharacterList } from "./useCharacterList"

/**
 * liked characters are the list of bookmarks and friends
 */
export function useLikedCharacters(): readonly Character[] {
  const context = useChatContext()
  const friendships = useStoreValue(context.characterStore.friendships)
  const bookmarkNames = useStoreValue(
    context.characterStore.bookmarks.selectKeys(),
  )
  return useCharacterList([...friendships.map((f) => f.them), ...bookmarkNames])
}
