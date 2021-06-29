import { createContext, useCallback, useContext, useRef } from "react"
import { raise } from "../common/raise"

export interface Toast {
	key: string
	element: HTMLElement
}

interface ContextType {
	register: (key: string) => HTMLElement
	unregister: (key: string) => void
}

const Context = createContext<ContextType>()

export default function ToastProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const containerRef = useRef<HTMLDivElement>(null)
	const toastListRef = useRef<Toast[]>([])

	const register = useCallback((key: string) => {
		const element = document.createElement("div")
		containerRef.current?.append(element)
		toastListRef.current.push({ key, element })
		return element
	}, [])

	const unregister = useCallback((key: string) => {
		const toasts = toastListRef.current
		for (let i = toasts.length - 1; i >= 0; i--) {
			const toast = toasts[i]
			if (toast?.key === key) {
				toast.element.remove()
				toasts.splice(i, 1)
			}
		}
	}, [])

	return (
		<Context.Provider value={{ register, unregister }}>
			{children}
			<div
				className="fixed inset-0 flex flex-col items-center gap-4 p-4"
				ref={containerRef}
			/>
		</Context.Provider>
	)
}

export function useToastContext() {
	return useContext(Context) ?? raise("ToastProvider not found")
}
