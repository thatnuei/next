import type { ReactNode } from "react"
import { useLayoutEffect, useRef } from "react"
import ReactDOM from "react-dom"

interface Props {
	children: ReactNode
}

function Portal(props: Props) {
	const containerRef = useRef<HTMLDivElement>()

	if (!containerRef.current && typeof window !== "undefined") {
		containerRef.current = document.createElement("div")
		document.body.appendChild(containerRef.current)
	}

	useLayoutEffect(() => () => containerRef.current?.remove(), [])

	return containerRef.current ? (
		ReactDOM.createPortal(props.children, containerRef.current)
	) : (
		<>{props.children}</>
	)
}

export default Portal
