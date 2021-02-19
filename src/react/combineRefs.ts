import type { Ref } from "react"

export default function combineRefs<T>(
	...refs: Array<Ref<T> | null | undefined>
) {
	return (instance: T | null) => {
		for (const ref of refs) {
			if (typeof ref === "function") {
				ref(instance)
			} else if (ref) {
				// react types are weird and types refs that get mutated as readonly lol
				// @ts-expect-error
				ref.current = instance
			}
		}
	}
}
