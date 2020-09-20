import { observable } from "micro-observables"

export class ObservableSet<T> {
	private readonly valuesMutable = observable<T[]>([])

	get values() {
		return this.valuesMutable.readOnly()
	}

	add(value: T) {
		this.valuesMutable.update((values) => {
			const set = new Set(values)
			set.add(value)
			return [...set]
		})
	}

	remove(value: T) {
		this.valuesMutable.update((values) => {
			const set = new Set(values)
			set.delete(value)
			return [...set]
		})
	}
}

export function observableSet<T>() {
	return new ObservableSet<T>()
}
