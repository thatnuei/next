function importIdb() {
	if (typeof window !== "undefined") {
		return import("idb-keyval")
	}
}

export function createIdbStorage<T>(key: string) {
	return {
		get: async () => {
			const idb = await importIdb()
			return idb?.get<T | undefined>(key)
		},
		set: async (value: T) => {
			const idb = await importIdb()
			await idb?.set(key, value)
		},
		del: async () => {
			const idb = await importIdb()
			await idb?.del(key)
		},
	}
}
