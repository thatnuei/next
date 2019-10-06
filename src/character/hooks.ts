import useRootStore from "../useRootStore"

export function useCharacter(name: string) {
  const { characterStore } = useRootStore()
  return characterStore.characters.get(name)
}
