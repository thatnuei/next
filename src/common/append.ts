export const append =
	<T>(...newItems: T[]) =>
	(items: readonly T[]) =>
		items.concat(newItems)
