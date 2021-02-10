import { useState } from "react"
import { tw } from "twind"
import { useWindowEvent } from "../dom/useWindowEvent"

function DevTools() {
	const [visible, setVisible] = useState(false)
	const toggleVisible = () => setVisible((v) => !v)

	useWindowEvent("keypress", (event) => {
		if (event.code === "Backquote" && event.shiftKey) {
			event.preventDefault()
			toggleVisible()
		}
	})

	return (
		<div
			className={tw`fixed top-0 left-0 right-0 p-4 bg-black bg-opacity-50 transition-all transform ${
				visible
					? `opacity-100 visible`
					: `opacity-0 invisible -translate-y-full`
			}`}
		>
			i might give this some other purpose later lol
		</div>
	)
}

export default DevTools
