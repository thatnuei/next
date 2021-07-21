import { useEffect, useState } from "react"

type PromiseState<T> =
	| { status: "idle"; value?: T | undefined; error?: undefined }
	| { status: "pending"; value?: T | undefined; error?: undefined }
	| { status: "resolved"; value: T; error?: undefined }
	| { status: "rejected"; value?: T | undefined; error: Error }

export default function usePromise<T>(promise: T | Promise<T> | undefined) {
	const [state, setState] = useState<PromiseState<T>>({ status: "idle" })

	useEffect(() => {
		if (!promise) {
			setState({ status: "idle" })
			return
		}

		let cancelled = false

		setState((state) => ({ status: "pending", value: state.value }))

		Promise.resolve(promise)
			.then((value) => {
				if (cancelled) return
				setState({ status: "resolved", value })
			})
			.catch((error: unknown) => {
				if (cancelled) return
				setState((state) => ({
					status: "rejected",
					error: error instanceof Error ? error : new Error(String(error)),
					value: state.value,
				}))
			})

		return () => {
			cancelled = true
		}
	}, [promise])

	return {
		...state,
		isLoading: state.status === "pending",
		isSuccess: state.status === "resolved",
		isError: state.status === "rejected",
	}
}
