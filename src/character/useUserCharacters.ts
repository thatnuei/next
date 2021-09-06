import { useChatContext } from "../chat/ChatContext"
import type { Character } from "./types"
import { useCharacterList } from "./useCharacterList"

export function useUserCharacters(): readonly Character[] {
  const context = useChatContext()
  return useCharacterList(context.userCharacters)
}
