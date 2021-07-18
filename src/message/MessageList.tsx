import clsx from "clsx"
import { memo, useLayoutEffect, useRef } from "react"
import MessageListItem from "./MessageListItem"
import type { MessageState } from "./MessageState"

interface Props {
	messages: readonly MessageState[]
	isStale?: boolean
}

const bottomScrollThreshold = 20

function MessageList({ messages, isStale }: Props) {
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
		<ol
			className={clsx(
				"h-full overflow-y-auto transition-opacity transform translate-z-0",
				isStale && `opacity-50`,
			)}
			style={{ transitionDelay: isStale ? "0.5s" : "0s" }}
			ref={containerRef}
		>
			{messages.map((message) => (
				<li key={message.key}>
					<MessageListItem message={message} />
				</li>
			))}
		</ol>
	)
}

export default memo(MessageList)
