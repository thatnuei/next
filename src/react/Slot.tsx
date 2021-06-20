import type { ReactElement } from "react";
import { cloneElement } from "react"

export default function Slot({
	element,
	...props
}: {
	element: ReactElement
	[key: string]: unknown
}) {
	return cloneElement(element, props)
}
