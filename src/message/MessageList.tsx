import clsx from "clsx"
import { memo, useDeferredValue, useEffect, useRef, useState } from "react"
import MessageListItem from "./MessageListItem"
import type { MessageState } from "./MessageState"

interface Props {
	messages: readonly MessageState[]
}

export default memo(function MessageList({ messages }: Props) {
	const deferredMessages = useDeferredValue(messages)
	const isStale = deferredMessages !== messages
	const containerRef = useBottomScroll()

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

const bottomScrollThreshold = 20

function useBottomScroll() {
	const [container, containerRef] = useState<Element | null>()
	const bottomScrolledRef = useRef(true)

	useEffect(() => {
		if (!container) return

		const handleScroll = () => {
			bottomScrolledRef.current =
				container.scrollTop >=
				container.scrollHeight - container.clientHeight - bottomScrollThreshold
		}

		container.addEventListener("scroll", handleScroll)
		return () => container.removeEventListener("scroll", handleScroll)
	}, [container])

	useEffect(() => {
		if (!container) return

		const handleResize = () => {
			if (bottomScrolledRef.current) {
				container.scrollTop = container.scrollHeight - container.clientHeight
			}
		}

		const observer = new ResizeObserver(handleResize)
		observer.observe(container)
		return () => observer.disconnect()
	}, [container])

	useEffect(() => {
		if (!container) return
		container.scrollTop = container.scrollHeight - container.clientHeight
	}, [container])

	return containerRef
}
