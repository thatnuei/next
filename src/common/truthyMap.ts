export function truthyMap(keys: readonly string[]): Record<string, true> {
	return Object.fromEntries(keys.map((key) => [key, true]))
}
