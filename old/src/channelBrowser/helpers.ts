import { useObservable } from "micro-observables"
import { useRootStore } from "../root/context"

export function useIsPublicChannel(channelId: string) {
  const root = useRootStore()
  return useObservable(root.channelBrowserStore.isPublic(channelId))
}
