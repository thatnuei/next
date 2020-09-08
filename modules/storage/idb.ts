import { del, get, set } from "idb-keyval"

export function createIdbStorage<T>(key: string) {
	return {
		get: () => get<T | undefined>(key),
		set: (value: T) => set(key, value),
		del: () => del(key),
	}
}
