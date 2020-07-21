import { useObservable } from "micro-observables"
import { useRootStore } from "../root/context"

export function useIsPublicChannel(channelId: string) {
  const root = useRootStore()
  const publicChannels = useObservable(root.channelBrowserStore.publicChannels)
  return publicChannels.some((ch) => ch.id === channelId)
}
