import { createSetup, ref } from "reactivue"

export type Toast = {
	key: string
	text: string
}

export const useToastStore = createSetup(() => {
	const toasts = ref<Toast[]>([])

	const show = (text: string) => {
		toasts.value = [...toasts.value, { text, key: String(Math.random()) }]
	}

	const remove = (id: Toast["key"]) => {
		toasts.value = toasts.value.filter((t) => t.key !== id)
	}

	return { toasts, show, remove }
})
