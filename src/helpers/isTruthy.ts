type Falsy = false | undefined | null | "" | 0

export function isTruthy<V>(value: V): value is Exclude<V, Falsy> {
	return Boolean(value)
}
