import { useObservable } from "micro-observables"
import { useMemo } from "react"
import { useRootStore } from "../root/context"
import { useRepository } from "../state/repository"
import { ChannelBrowserStore } from "./ChannelBrowserStore"

export function useChannelBrowserStore() {
  const root = useRootStore()
  const repo = useRepository()
  return useMemo(() => new ChannelBrowserStore(repo, root.socket), [
    repo,
    root.socket,
  ])
}

export function useIsPublicChannel(channelId: string) {
  return useObservable(useChannelBrowserStore().isPublic(channelId))
}
