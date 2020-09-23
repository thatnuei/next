import { useEffect } from "react"

export function useEventTarget<E extends keyof HTMLElementEventMap>(
	targetRef: React.RefObject<HTMLElement>,
	event: E,
	callback: (event: HTMLElementEventMap[E]) => void,
	options?: AddEventListenerOptions,
): void

export function useEventTarget<E extends keyof WindowEventMap>(
	targetRef: React.RefObject<Window>,
	event: E,
	callback: (event: WindowEventMap[E]) => void,
	options?: AddEventListenerOptions,
): void

export function useEventTarget(
	targetRef: React.RefObject<EventTarget>,
	event: string,
	callback: (event: Event) => void,
	options?: AddEventListenerOptions,
) {
	useEffect(() => {
		const target = targetRef.current
		target?.addEventListener(event, callback, options)
		return () => target?.removeEventListener(event, callback, options)
	})
}
