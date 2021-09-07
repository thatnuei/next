import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import type { Character } from "./types"

export function useCharacterList(
  names: readonly string[],
): readonly Character[] {
  const context = useChatContext()
  return useStoreValue(context.characterStore.selectCharacterList(names))
}
