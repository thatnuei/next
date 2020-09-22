import { useEffect } from "react"

export function useEventTarget<E extends keyof HTMLElementEventMap>(
	target: HTMLElement | undefined | null,
	event: E,
	callback: (event: HTMLElementEventMap[E]) => void,
	options?: EventListenerOptions,
): void

export function useEventTarget<E extends keyof WindowEventMap>(
	target: Window | undefined | null,
	event: E,
	callback: (event: WindowEventMap[E]) => void,
	options?: EventListenerOptions,
): void

export function useEventTarget(
	target: EventTarget | undefined | null,
	event: string,
	callback: (event: Event) => void,
	options?: boolean | AddEventListenerOptions,
) {
	useEffect(() => {
		target?.addEventListener(event, callback, options)
		return () => target?.removeEventListener(event, callback, options)
	})
}
