import { useCallback, useLayoutEffect, useState } from "react"
import MessageListItem from "./MessageListItem"
import type { MessageState } from "./MessageState"

interface Props {
	messages: MessageState[]
}

function MessageList({ messages }: Props) {
	const [container, setContainer] = useState<HTMLElement | null>()

	useBottomScroll(container, messages[messages.length - 1])

	return (
		<ol className="h-full overflow-y-auto" ref={setContainer}>
			{messages.map((message) => (
				<li key={message.key}>
					<MessageListItem message={message} />
				</li>
			))}
		</ol>
	)
}

export default MessageList

function useBottomScroll(
	container: HTMLElement | null | undefined,
	watchedValue: unknown,
) {
	const wasScrolledToBottom =
		container &&
		container.scrollHeight >= container.scrollHeight - container.clientHeight

	const scrollToBottom = useCallback(() => {
		if (!container) return
		container.scrollTop = container.scrollHeight
	}, [container])

	useLayoutEffect(() => {
		if (wasScrolledToBottom) scrollToBottom()
	}, [scrollToBottom, wasScrolledToBottom, watchedValue])

	useLayoutEffect(scrollToBottom, [scrollToBottom])
}
