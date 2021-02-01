export const safeIndex = <T>(
	items: ArrayLike<T>,
	index: number,
): T | undefined => items[index]
