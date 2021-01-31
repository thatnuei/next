import { useObservable } from "micro-observables"
import { useRootStore } from "../root/context"

export function useIdentity() {
	const root = useRootStore()
	return useObservable(root.appStore.identity)
}
