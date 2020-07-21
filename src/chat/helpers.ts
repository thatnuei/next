import { useObservable } from "micro-observables"
import { useRootStore } from "../root/context"

export function useChatCredentials() {
  const root = useRootStore()
  const { account, ticket } = useObservable(root.userStore.userData)
  const identity = useObservable(root.appStore.identity)
  return { account, ticket, identity }
}
