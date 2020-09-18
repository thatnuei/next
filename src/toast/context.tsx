import constate from "constate"
import { useToastStore } from "./useToastStore"

export const [
	ToastStoreProvider,
	useToastStoreState,
	useToastStoreActions,
] = constate(
	useToastStore,
	(value) => value.toasts,
	({ show, remove }) => ({ show, remove }),
)
