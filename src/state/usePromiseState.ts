import { useState } from "react"
import usePromise from "./usePromise"

export default function usePromiseState<T>(initialPromise?: Promise<T>) {
	const [promise, setPromise] = useState<Promise<T>>()
	const state = usePromise(promise)
	return { ...state, setPromise }
}
