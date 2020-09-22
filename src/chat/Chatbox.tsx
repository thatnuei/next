import { SyntheticEvent, useState } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import Button from "../ui/Button"

export function Chatbox(props: { onSubmit: (message: string) => void }) {
	const [rawValue, setRawValue] = useState("")

	function submit(e: SyntheticEvent) {
		e.preventDefault()

		const value = rawValue.trim()
		if (value) {
			props.onSubmit(value)
			setRawValue("")
		}
	}

	return (
		<form className="flex p-2 space-x-2 bg-midnight-0" onSubmit={submit}>
			<ExpandingTextArea
				value={rawValue}
				onChange={(event) => setRawValue(event.currentTarget.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
						event.preventDefault()
					}
				}}
				onKeyUp={(event) => {
					if (event.key === "Enter") submit(event)
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
