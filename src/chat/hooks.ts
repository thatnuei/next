import { useStore } from "../store/hooks"

export function useChatIdentity() {
  const store = useStore()
  const { identity, identityCharacter } = store.state.chat
  return { identity, identityCharacter }
}
