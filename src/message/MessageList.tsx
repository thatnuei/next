import clsx from "clsx"
import { memo, useDeferredValue, useLayoutEffect, useRef } from "react"
import MessageListItem from "./MessageListItem"
import type { MessageState } from "./MessageState"

interface Props {
	messages: readonly MessageState[]
}

const bottomScrollThreshold = 20

export default memo(function MessageList({ messages }: Props) {
	const deferredMessages = useDeferredValue(messages)
	const isStale = deferredMessages !== messages
	const containerRef = useBottomScroll(messages)

	return (
		<ol
			className={clsx(
				"h-full overflow-y-auto transition-opacity transform translate-z-0",
				isStale && `opacity-50`,
			)}
			style={{ transitionDelay: isStale ? "0.5s" : "0s" }}
			ref={containerRef}
		>
			{deferredMessages.map((message) => (
				<li key={message.key}>
					<MessageListItem message={message} />
				</li>
			))}
		</ol>
	)
})

function useBottomScroll(messages: readonly MessageState[]) {
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
	return containerRef
}
