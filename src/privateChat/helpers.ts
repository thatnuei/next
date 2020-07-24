import { useObservable } from "micro-observables"
import { useRootStore } from "../root/context"

export function usePrivateChat(partnerName: string) {
  const root = useRootStore()
  return root.privateChatStore.getChat(partnerName)
}

export function useOpenPrivateChats() {
  const root = useRootStore()
  return useObservable(root.privateChatStore.openChats())
}
