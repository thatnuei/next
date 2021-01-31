import { useObservable } from "micro-observables"
import { useRootStore } from "../root/context"

export function useChannel(id: string) {
	const root = useRootStore()
	return root.channelStore.getChannel(id)
}

export function useJoinedChannels() {
	const root = useRootStore()
	return useObservable(root.channelStore.joinedChannels())
}
