import { useState } from "react"
import usePromise from "./usePromise"

export default function usePromiseState<T>(initialPromise?: Promise<T> | T) {
	const [promise, setPromise] = useState(initialPromise)
	const state = usePromise(promise)
	return { ...state, setPromise }
}
