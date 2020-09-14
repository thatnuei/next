import { observable } from "micro-observables"

type Toast = {
	key: string
	text: string
}

export class ToastStore {
	readonly toasts = observable<Toast[]>([])

	show = (text: string) => {
		this.toasts.update(toasts =>
			toasts.concat({ text, key: String(Math.random()) }),
		)
	}

	remove = (id: Toast["key"]) => {
		this.toasts.update(toasts => toasts.filter(t => t.key !== id))
	}
}
