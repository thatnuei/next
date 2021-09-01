import { useChatContext } from "../chat/ChatContext"
import { unique } from "../common/unique"
import { useStoreValue } from "../state/store"
import { createCharacter } from "./CharacterStore"
import type { Character } from "./types"

export function useCharacterList(names: string[]): readonly Character[] {
  const context = useChatContext()

  return useStoreValue(
    context.characterStore.characters.select((characters) =>
      unique(
        names.map((name) => characters[name] ?? createCharacter(name)),
        (char) => char.name,
      ),
    ),
  )
}
