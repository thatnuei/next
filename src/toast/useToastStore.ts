import { observable } from "micro-observables"

export type Toast = {
	key: string
	text: string
}

export class ToastStore {
	toasts = observable<Toast[]>([])

	show = (text: string) => {
		this.toasts.update((toasts) => [
			...toasts,
			{ text, key: String(Math.random()) },
		])
	}

	remove = (id: Toast["key"]) => {
		this.toasts.update((toasts) => toasts.filter((t) => t.key !== id))
	}
}
