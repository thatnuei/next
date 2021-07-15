import type { Instance as PopperInstance, Placement } from "@popperjs/core"
import { createPopper } from "@popperjs/core"
import { useEffect, useRef, useState } from "react"

export default function usePopper({
	placement = "top",
}: { placement?: Placement } = {}) {
	const [reference, referenceRef] = useState<HTMLElement | null>()
	const [popper, popperRef] = useState<HTMLElement | null>()
	const instanceRef = useRef<PopperInstance>()

	useEffect(() => {
		if (!reference || !popper) return

		const instance = (instanceRef.current = createPopper(reference, popper, {
			placement,
		}))

		return () => {
			instance.destroy()
			instanceRef.current = undefined
		}
	}, [placement, popper, reference])

	useEffect(() => {
		instanceRef.current?.update()
	})

	return { referenceRef, popperRef }
}
