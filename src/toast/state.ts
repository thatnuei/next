import type { ReactNode } from "react"
import { useCallback } from "react"
import { atom, useRecoilValue, useSetRecoilState } from "recoil"
import { uniqueId } from "../common/uniqueId"

export interface ToastOptions {
	type: "info" | "success" | "warning" | "error"
	duration: number
	content: ReactNode
	onClick?: () => void
}

export interface ToastInstance extends ToastOptions {
	key: string
}

const toastListAtom = atom<ToastInstance[]>({
	key: "toastList",
	default: [],
})

export function useToastInstances() {
	return useRecoilValue(toastListAtom)
}

export function useShowToast() {
	const setToasts = useSetRecoilState(toastListAtom)

	return useCallback(
		(options: ToastOptions) => {
			setToasts((toasts) => [...toasts, { ...options, key: uniqueId() }])
		},
		[setToasts],
	)
}

export function useRemoveToast() {
	const setToasts = useSetRecoilState(toastListAtom)

	return useCallback(
		(key: string) => {
			setToasts((toasts) => toasts.filter((toast) => toast.key !== key))
		},
		[setToasts],
	)
}
