import * as idb from "idb-keyval"

export function createIdbStorage<T>(key: string) {
	return {
		get: () => idb?.get<T | undefined>(key),
		set: async (value: T) => {
			await idb?.set(key, value)
		},
		del: async () => {
			await idb?.del(key)
		},
	}
}
