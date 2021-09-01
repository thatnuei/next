import { useChatContext } from "../chat/ChatContext"
import { isTruthy } from "../common/isTruthy"
import { useStoreValue } from "../state/store"

export function useCharacterList(names: string[]) {
  const context = useChatContext()

  return useStoreValue(
    context.characterStore.characters.select((characters) =>
      names.map((name) => characters[name]).filter(isTruthy),
    ),
  )
}
