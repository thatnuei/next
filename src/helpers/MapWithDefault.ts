export class MapWithDefault<K = string, V = unknown> extends Map<K, V> {
	constructor(private readonly getDefault: (key: K) => V) {
		super()
	}

	get(key: K): V {
		if (this.has(key)) {
			return this.get(key) as V
		} else {
			const value = this.getDefault(key)
			this.set(key, value)
			return value
		}
	}
}
