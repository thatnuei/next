import stringify from "fast-json-stable-stringify"
import { useCallback, useReducer } from "react"

type ResourceInput =
	| string
	| number
	| boolean
	| null
	| undefined
	| void
	| ResourceInput[]
	| { [key: string]: ResourceInput }

type ResourceItemState<T> =
	| { status: "pending"; promise: Promise<T> }
	| { status: "loaded"; data: T }
	| { status: "error"; error: unknown }

export class Resource<T, I extends ResourceInput = void> {
	private items = new Map<string, ResourceItemState<T>>()

	constructor(private readonly getData: (input: I) => Promise<T>) {}

	static of<T, I extends ResourceInput>(getData: (input: I) => Promise<T>) {
		return new Resource(getData)
	}

	read(input: I): T {
		const key = stringify(input)
		const item = this.items.get(key)

		if (!item) {
			const promise = this.getData(input)
			this.items.set(key, { status: "pending", promise })
			throw promise
		}

		if (item.status === "pending") throw item.promise
		if (item.status === "error") throw item.error

		return item.data
	}

	setData(data: T, input: I) {
		this.items.set(stringify(input), { status: "loaded", data })
	}

	invalidate(input: I) {
		this.items.delete(stringify(input))
	}
}

export function useResource<T, I extends ResourceInput>(res: Resource<T, I>) {
	const [, forceUpdate] = useReducer(state => !state, false)

	const read = useCallback((input: I) => res.read(input), [res])

	const setData = useCallback(
		(data: T, input: I) => {
			res.setData(data, input)
			forceUpdate()
		},
		[res],
	)

	const invalidate = useCallback(
		(input: I) => {
			res.invalidate(input)
			forceUpdate()
		},
		[res],
	)

	return { read, setData, invalidate }
}
