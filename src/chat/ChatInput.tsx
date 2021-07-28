import type { FormEvent, KeyboardEvent, ReactNode } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import BBCTextArea from "../bbc/BBCInput"
import Button from "../dom/Button"
import { useNotificationActions } from "../notifications/state"
import type { TypingStatus } from "../privateChat/types"
import { solidButton } from "../ui/components"
import { useIdentity } from "../user"

interface Props {
	value: string
	maxLength?: number
	renderPreview: (value: string) => ReactNode
	onChangeText: (value: string) => void
	onSubmit: (text: string) => void
	onTypingStatusChange?: (typingStatus: TypingStatus) => void
}

export default function ChatInput(props: Props) {
	const identity = useIdentity()
	const notificationActions = useNotificationActions()

	const valueTrimmed = props.value.trim()

	const [typingTimerComplete, startTypingTimer] = useTimer(4000)
	useEffect(() => {
		if (valueTrimmed) startTypingTimer()
	}, [startTypingTimer, valueTrimmed])

	const lastTypingStatus = useRef<TypingStatus>("clear")
	useEffect(() => {
		function updateTypingStatus(typingStatus: TypingStatus) {
			if (typingStatus !== lastTypingStatus.current) {
				props.onTypingStatusChange?.(typingStatus)
				lastTypingStatus.current = typingStatus
			}
		}

		if (!valueTrimmed) {
			updateTypingStatus("clear")
			return
		}

		if (typingTimerComplete) {
			updateTypingStatus("paused")
			return
		}

		updateTypingStatus("typing")
		return () => {
			updateTypingStatus("paused")
		}
	}, [props, typingTimerComplete, valueTrimmed])

	function submit() {
		const maxLength = props.maxLength ?? Infinity
		if (valueTrimmed.length <= maxLength) {
			props.onSubmit(valueTrimmed)
			props.onChangeText("")
		} else {
			notificationActions.addNotification({
				type: "error",
				message: `Your message is too long! Shorten it to ${maxLength} characters or less.`,
				save: false,
				showToast: true,
			})
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
			event.preventDefault()
			submit()
		}
	}

	function handleFormSubmit(event: FormEvent) {
		event.preventDefault()
		submit()
	}

	return (
		<form
			onSubmit={handleFormSubmit}
			className={`flex flex-row p-2 bg-midnight-0`}
		>
			<div className="flex-1 mr-2 block">
				<BBCTextArea
					placeholder={`Chatting as ${identity || ""}...`}
					value={props.value}
					onChangeText={props.onChangeText}
					maxLength={props.maxLength}
					onKeyDown={handleKeyDown}
					renderPreview={props.renderPreview}
				/>
			</div>
			<Button type="submit" className={solidButton}>
				Send
			</Button>
		</form>
	)
}

function useTimer(period: number) {
	const [complete, setComplete] = useState(false)
	const timeoutRef = useRef<number>()

	const start = useCallback(() => {
		setComplete(false)
		window.clearTimeout(timeoutRef.current)
		timeoutRef.current = window.setTimeout(() => setComplete(true), period)
	}, [period])

	useEffect(() => {
		return () => {
			window.clearTimeout(timeoutRef.current)
		}
	}, [])

	return [complete, start] as const
}
