import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ChannelMessage } from "../channel/types"
import { useEventTarget } from "../dom/useEventTarget"

type Props = {
	messages: ChannelMessage[]
}

export default function MessageList({ messages }: Props) {
	const [list, setList] = useState<HTMLElement | null>()

	const getScrolledToBottom = () => {
		if (!list) return true
		return list.scrollTop >= list.scrollHeight - list.clientHeight - 20
	}

	const [isScrolledToBottom, setIsScrolledToBottom] = useState(
		getScrolledToBottom,
	)

	useEventTarget(
		list,
		"scroll",
		() => {
			setIsScrolledToBottom(getScrolledToBottom())
		},
		{ passive: true },
	)

	const scrollToBottom = useCallback(() => {
		list?.scrollTo({
			top: list.scrollHeight - list.clientHeight,
			behavior: "smooth",
		})
	}, [list])

	useEffect(() => {
		if (list && isScrolledToBottom) {
			scrollToBottom()
		}
	}, [isScrolledToBottom, list, messages, scrollToBottom])

	const messageList = useMemo(() => {
		return (
			<ul
				className="h-full space-y-1 overflow-y-auto"
				tabIndex={0}
				ref={setList}
			>
				{messages.map((message) => (
					<li key={message.id} className="bg-midnight-1">
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
				))}
			</ul>
		)
	}, [messages])

	return (
		<div className="relative h-full overflow-hidden">
			{messageList}

			<AnimatePresence>
				{!isScrolledToBottom && (
					<motion.button
						type="button"
						className="absolute bottom-0 w-full p-2 text-sm text-center bg-black bg-opacity-75"
						onClick={scrollToBottom}
						initial={{ y: "100%" }}
						animate={{ y: "0" }}
						exit={{ y: "100%" }}
						transition={{ ease: "circOut", duration: 0.3 }}
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
