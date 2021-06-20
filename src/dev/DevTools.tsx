import { useState } from "react"
import { useWindowEvent } from "../dom/useWindowEvent"
import Drawer from "../ui/Drawer"
import CommandSimulator from "./CommandSimulator"

export default function DevTools() {
	const [visible, setVisible] = useState(false)
	const toggleVisible = () => setVisible((v) => !v)

	useWindowEvent("keypress", (event) => {
		if (event.code === "Backquote" && event.shiftKey) {
			event.preventDefault()
			toggleVisible()
		}
	})

	return (
		<Drawer side="bottom" open={visible} onOpenChange={setVisible}>
			<div className="w-full p-4">
				<CommandSimulator />
			</div>
		</Drawer>
	)
}
