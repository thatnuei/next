import { useStore } from "../store/hooks"

export function useCharacter(name: string) {
  const store = useStore()
  return store.state.character.getCharacter(name)
}
