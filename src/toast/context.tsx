import constate from "constate"
import { useObservable } from "micro-observables"
import { useMemo } from "react"
import { ToastStore } from "./useToastStore"

export const [
	ToastStoreProvider,
	useToastStoreState,
	useToastStoreActions,
] = constate(
	() => useMemo(() => new ToastStore(), []),
	(value) => useObservable(value.toasts),
	({ show, remove }) => ({ show, remove }),
)
