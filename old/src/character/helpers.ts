import { useIdentity } from "../app/helpers"
import { useRootStore } from "../root/context"

export function useCharacter(name: string) {
  const root = useRootStore()
  return root.characterStore.getCharacter(name)
}

export function useIdentityCharacter() {
  return useCharacter(useIdentity())
}