import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useVirtual } from "react-virtual"
import { ChannelMessage } from "../channel/types"
import { useEventTarget } from "../dom/useEventTarget"
import { useEffectRef } from "../react/useEffectRef"

type Props = {
	messages: ChannelMessage[]
}

// the list scroll jumps a bit when scrolled up and new messages come in
// I have no idea how to fix that, aside from removing virtualization :(
// this is fine for now
export default function MessageList({ messages }: Props) {
	const listRef = useRef<HTMLDivElement>(null)

	const getScrolledToBottom = () => {
		const list = listRef.current
		if (!list) return true
		return list.scrollTop >= list.scrollHeight - list.clientHeight - 20
	}

	const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)

	useEventTarget(
		listRef,
		"scroll",
		() => {
			setIsScrolledToBottom(getScrolledToBottom())
		},
		{ passive: true },
	)

	const { virtualItems, totalSize, scrollToOffset } = useVirtual({
		size: messages.length,
		parentRef: listRef,
		estimateSize: useCallback(() => 50, []),
		overscan: 10,
	})

	// so dependent effects don't run when the size changes
	const totalSizeRef = useEffectRef(totalSize)

	const scrollToBottom = useCallback(() => {
		scrollToOffset(totalSizeRef.current)
	}, [scrollToOffset, totalSizeRef])

	useEffect(() => {
		if (isScrolledToBottom) {
			// delay to give react and the virtual list a chance to resolve sizing on things
			requestAnimationFrame(scrollToBottom)
		}
	}, [isScrolledToBottom, messages, scrollToBottom])

	return (
		<div className="relative h-full overflow-hidden">
			<div className="h-full overflow-y-auto" tabIndex={0} ref={listRef}>
				<ul style={{ height: totalSize, position: "relative" }}>
					{virtualItems.map((virtualItem) => {
						const message = messages[virtualItem.index]
						if (!message) return null

						return (
							<li
								key={virtualItem.index}
								ref={virtualItem.measureRef}
								className="absolute top-0 left-0 w-full bg-midnight-1"
								style={{ transform: `translateY(${virtualItem.start}px)` }}
							>
								<div className={clsx("px-3 py-1", messageColorClass(message))}>
									<span className="float-right pl-2 text-sm italic opacity-50">
										{new Date(message.time).toLocaleTimeString()}
									</span>

									{message.senderName && (
										<strong className="inline-block mr-3 font-medium">
											{message.senderName}
										</strong>
									)}

									<span className="whitespace-pre-line">{message.text}</span>
								</div>
							</li>
						)
					})}
				</ul>
			</div>

			<AnimatePresence>
				{!isScrolledToBottom && (
					<motion.button
						type="button"
						className="absolute bottom-0 w-full p-1 text-sm text-center bg-black bg-opacity-75"
						onClick={scrollToBottom}
						initial={{ y: "100%", opacity: 0 }}
						animate={{ y: "0", opacity: 1, transition: { delay: 0.2 } }}
						exit={{ y: "100%" }}
					>
						Scroll to bottom
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	)
}

function messageColorClass(message: ChannelMessage) {
	return {
		normal: "",
		ad: "bg-green-500 bg-opacity-25",
		admin: "bg-red-600 bg-opacity-25",
		system: "bg-black bg-opacity-50",
	}[message.type]
}
