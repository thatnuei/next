import { atom, useAtom } from "jotai"
import { useUpdateAtom } from "jotai/utils"
import type { ReactNode } from "react"
import { useCallback } from "react"
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

const toastListAtom = atom<ToastInstance[]>([])

export function useToastInstances() {
	return useAtom(toastListAtom)[0]
}

export function useShowToast() {
	const setToasts = useUpdateAtom(toastListAtom)

	return useCallback(
		(options: ToastOptions) => {
			setToasts((toasts) => [...toasts, { ...options, key: uniqueId() }])
		},
		[setToasts],
	)
}

export function useRemoveToast() {
	const setToasts = useUpdateAtom(toastListAtom)

	return useCallback(
		(key: string) => {
			setToasts((toasts) => toasts.filter((toast) => toast.key !== key))
		},
		[setToasts],
	)
}
