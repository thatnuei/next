import stringify from "fast-json-stable-stringify"

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

export class Resource<T, I extends ResourceInput> {
	private static cache = new Map<string | symbol, unknown>()

	private state: ResourceItemState<T>

	constructor(input: I, getData: (input: I) => Promise<T>) {
		const key = typeof input === "symbol" ? input : stringify(input)

		if (Resource.cache.has(key)) {
			this.state = { status: "loaded", data: Resource.cache.get(key) as T }
			return
		}

		const promise = getData(input)
		this.state = { status: "pending", promise }

		promise
			.then((data) => {
				this.state = { status: "loaded", data }
				Resource.cache.set(key, data)
			})
			.catch((error: unknown) => {
				this.state = { status: "error", error }
			})
	}

	static of<T, I extends ResourceInput>(
		input: I,
		getData: (input: I) => Promise<T>,
	) {
		return new Resource(input, getData)
	}

	read(): T {
		if (this.state.status === "pending") throw this.state.promise
		if (this.state.status === "error") throw this.state.error
		return this.state.data
	}
}
