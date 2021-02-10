import { useCallback, useLayoutEffect, useState } from "react"
import { tw } from "twind"
import { TagProps } from "../jsx/types"
import { scrollVertical } from "../ui/helpers"
import MessageListItem from "./MessageListItem"
import { MessageState } from "./MessageState"

type Props = {
	messages: MessageState[]
} & TagProps<"ol">

function MessageList({ messages, ...props }: Props) {
	const [container, setContainer] = useState<HTMLElement | null>()

	useBottomScroll(container, messages[messages.length - 1])

	return (
		<ol
			className={tw([scrollVertical, tw`space-y-0.5`])}
			ref={setContainer}
			{...props}
		>
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
