import type { SetStateAction, WritableAtom } from "jotai"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import type { Dict } from "../common/types"

type UpdateFn<T> = (prev: T) => T

export function dictionaryAtomFamily<T>(
	dictionaryAtom: WritableAtom<Dict<T>, SetStateAction<Dict<T>>>,
	fallback: (key: string) => T,
) {
	return atomFamily((key: string) => {
		return atom(
			(get) => {
				const channel = get(dictionaryAtom)[key]
				return channel ?? fallback(key)
			},
			(_, set, update: T | UpdateFn<T>) => {
				set(dictionaryAtom, (items) => {
					const item = items[key] ?? fallback(key)

					const newItem =
						typeof update === "function"
							? (update as UpdateFn<T>)(item)
							: update

					return { ...items, [key]: newItem }
				})
			},
		)
	})
}
