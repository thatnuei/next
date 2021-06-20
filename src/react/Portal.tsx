import { useLayoutEffect, useState } from "react"
import type * as React from "react"
import ReactDOM from "react-dom"

interface Props { children: React.ReactNode }

function Portal(props: Props) {
	const [container, setContainer] = useState<HTMLElement>()

	useLayoutEffect(() => {
		const el = document.createElement("div")
		document.body.append(el)
		setContainer(el)
		return () => el.remove()
	}, [])

	return container ? ReactDOM.createPortal(props.children, container) : null
}

export default Portal
