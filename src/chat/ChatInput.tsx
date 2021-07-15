import * as React from "react"
import BBCTextArea from "../bbc/BBCInput"
import Button from "../dom/Button"
import { solidButton } from "../ui/components"
import { useIdentity } from "../user"

interface Props {
	value: string
	maxLength?: number
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
			<div className="flex-1 block mr-2">
				<BBCTextArea
					placeholder={`Chatting as ${identity || ""}...`}
					value={props.value}
					onChangeText={props.onChangeText}
					maxLength={props.maxLength}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<Button type="submit" className={solidButton}>
				Send
			</Button>
		</form>
	)
}

export default ChatInput
