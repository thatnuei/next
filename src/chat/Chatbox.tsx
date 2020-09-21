import { useState } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import Button from "../ui/Button"

export function Chatbox(props: { onSubmit: (message: string) => void }) {
	const [rawValue, setRawValue] = useState("")

	function submit() {
		const value = rawValue.trim()
		if (value) {
			props.onSubmit(value)
			setRawValue("")
		}
	}

	return (
		<form
			className="flex p-2 space-x-2 bg-midnight-0"
			onSubmit={(e) => {
				e.preventDefault()
				submit()
			}}
		>
			<ExpandingTextArea
				value={rawValue}
				onChange={(e) => setRawValue(e.currentTarget.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
						submit()
						e.preventDefault()
					}
				}}
				className="flex-1 resize-none input-solid"
				placeholder="Say something..."
				aria-label="Message"
			/>
			<Button type="submit" className="px-4 button-solid">
				Send
			</Button>
		</form>
	)
}
