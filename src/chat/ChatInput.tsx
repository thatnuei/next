import * as React from "react"
import { useIdentity } from "../app/helpers"
import Button from "../dom/Button"
import { input, solidButton } from "../ui/components"

interface Props {
	value: string
	onChangeText: (value: string) => void
	onSubmit: (text: string) => void
}

function ChatInput(props: Props) {
	const identity = useIdentity()

	function submit() {
		props.onSubmit(props.value)
		props.onChangeText("")
	}

	function handleKeyDown(event: React.KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
			event.preventDefault()
			submit()
		}
	}

	function handleFormSubmit(event: React.FormEvent) {
		event.preventDefault()
		submit()
	}

	return (
		<form
			onSubmit={handleFormSubmit}
			className={`flex flex-row p-2 bg-midnight-0`}
		>
			<textarea
				placeholder={`Chatting as ${identity}...`}
				value={props.value}
				onChange={(event) => props.onChangeText(event.target.value)}
				onKeyDown={handleKeyDown}
				className={`${input} flex-1 block mr-2`}
			/>
			<Button type="submit" className={solidButton}>
				Send
			</Button>
		</form>
	)
}

export default ChatInput
