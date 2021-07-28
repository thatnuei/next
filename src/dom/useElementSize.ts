import type { RefObject } from "react"
import { useEffect, useMemo, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

export function useElementSize(
	ref: Element | RefObject<Element> | undefined | null,
) {
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)

	useEffect(() => {
		const element = ref instanceof Element ? ref : ref?.current
		if (!element) return

		const observer = new ResizeObserver(([info]: ResizeObserverEntry[]) => {
			if (info) {
				const rect = info.target.getBoundingClientRect()
				setWidth(rect.width)
				setHeight(rect.height)
			}
		})
		observer.observe(element)
		return () => observer.disconnect()
	}, [ref])

	return useMemo(() => ({ width, height }), [width, height])
}
