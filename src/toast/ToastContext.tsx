import React, { useContext, useMemo, useState } from "react"

type Toast = {
	key: string
	text: string
}

const Context = React.createContext({
	toasts: [] as Toast[],
	addToast: (text: string) => {},
	removeToast: (id: string) => {},
})

export function ToastProvider(props: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([])

	const context = useMemo(
		() => ({
			toasts,
			addToast(text: string) {
				setToasts(toasts => [...toasts, { text, key: String(Math.random()) }])
			},
			removeToast(key: string) {
				setToasts(toasts => toasts.filter(t => t.key !== key))
			},
		}),
		[toasts],
	)

	return <Context.Provider value={context}>{props.children}</Context.Provider>
}

export function useToastContext() {
	return useContext(Context)
}
