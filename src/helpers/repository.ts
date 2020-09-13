export function repository<T>(createNewItem: (key: string) => T) {
	const items = new Map<string, T>()

	function getItem(key: string): T {
		if (items.has(key)) {
			return items.get(key) as T
		}

		const newItem = createNewItem(key)
		items.set(key, newItem)
		return newItem
	}

	getItem.values = () => items.values()

	return getItem
}
