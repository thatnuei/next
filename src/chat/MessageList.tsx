import clsx from "clsx"
import React, { useEffect, useRef } from "react"
import { ChannelMessage } from "../channel/types"

type Props = {
	messages: ChannelMessage[]
}

export default function MessageList({ messages }: Props) {
	const listRef = useRef<HTMLUListElement>(null)

	const isScrolledToBottom = (() => {
		const list = listRef.current
		if (!list) return false
		return list.scrollTop >= list.scrollHeight - list.clientHeight - 10
	})()

	useEffect(() => {
		const list = listRef.current
		if (list && isScrolledToBottom) {
			list.scrollTop = list.scrollHeight - list.clientHeight
		}
	}, [isScrolledToBottom, messages])

	return (
		<ul
			className="h-full min-h-0 space-y-1 overflow-y-auto"
			tabIndex={0}
			ref={listRef}
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

						<span>{message.text}</span>
					</div>
				</li>
			))}
		</ul>
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
