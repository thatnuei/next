import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import { createCharacter } from "./CharacterStore"
import type { Character } from "./types"

export function useCharacter(name: string): Character {
  const context = useChatContext()
  return (
    useStoreValue(
      context.characterStore.characters.select((state) => state[name]),
    ) ?? createCharacter(name)
  )
}
