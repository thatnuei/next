export class ImmutableSet<T> {
	private constructor(private readonly internal = new Set<T>()) {}

	static empty = new ImmutableSet<never>()

	static of<T>(iterable?: Iterable<T>): ImmutableSet<T> {
		return iterable ? new ImmutableSet(new Set(iterable)) : ImmutableSet.empty
	}

	get size() {
		return this.internal.size
	}

	update(mutate: (set: Set<T>) => void) {
		const newSet = new Set(this.internal)
		mutate(newSet)
		return new ImmutableSet(newSet)
	}

	add(value: T) {
		return this.update(set => set.add(value))
	}

	delete(value: T) {
		return this.update(set => set.delete(value))
	}

	has(value: T) {
		return this.internal.has(value)
	}

	[Symbol.iterator](): IterableIterator<T> {
		return this.internal.values()
	}

	entries(): IterableIterator<[T, T]> {
		return this.internal.entries()
	}

	keys(): IterableIterator<T> {
		return this.internal.keys()
	}

	values(): IterableIterator<T> {
		return this.internal.values()
	}
}
