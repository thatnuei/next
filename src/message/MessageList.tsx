import { useLayoutEffect, useRef } from "react"
import MessageListItem from "./MessageListItem"
import type { MessageState } from "./MessageState"

interface Props {
	messages: readonly MessageState[]
}

const bottomScrollThreshold = 20

function MessageList({ messages }: Props) {
	const containerRef = useRef<HTMLOListElement | null>(null)

	const isBottomScrolled = () => {
		const container = containerRef.current
		if (!container) return false

		return (
			container.scrollTop >=
			container.scrollHeight - container.clientHeight - bottomScrollThreshold
		)
	}

	const scrollToBottom = () => {
		const container = containerRef.current
		if (!container) return
		container.scrollTop = container.scrollHeight - container.clientHeight
	}

	// check here, so that we get the bottom-scrolled state _before_ it changes from dom updates
	const wasScrolledToBottom = isBottomScrolled()
	useLayoutEffect(() => {
		if (wasScrolledToBottom) scrollToBottom()
	}, [wasScrolledToBottom, messages])

	useLayoutEffect(scrollToBottom, [])

	return (
		<ol className="h-full overflow-y-auto" ref={containerRef}>
			{messages.map((message) => (
				<li key={message.key}>
					<MessageListItem message={message} />
				</li>
			))}
		</ol>
	)
}

export default MessageList
