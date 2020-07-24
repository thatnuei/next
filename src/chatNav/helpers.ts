import { useObservable } from "micro-observables"
import { useRootStore } from "../root/context"

export function useChatNavView() {
  const root = useRootStore()
  return useObservable(root.chatNavStore.view)
}
