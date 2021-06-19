import { useObservable } from "micro-observables"
import { useMemo } from "react"
import ChatInput from "../chat/ChatInput"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { MessageState } from "../message/MessageState"
import { useRootStore } from "../root/context"
import { screenQueries } from "../ui/screens"
import ChannelHeader from "./ChannelHeader"
import ChannelUserList from "./ChannelUserList"
import { useChannel } from "./helpers"

type Props = {
	channelId: string
} & TagProps<"div">

function ChannelView({ channelId, ...props }: Props) {
	const root = useRootStore()
	const channel = useChannel(channelId)
	const messages = useObservable(channel.messages)
	const chatInput = useObservable(channel.chatInput)
	const actualMode = useObservable(channel.actualMode)

	const isLargeScreen = useMediaQuery(screenQueries.large)

	function updateChatInput(chatInput: string) {
		channel.chatInput.set(chatInput)
	}

	function submitChatInput(text: string) {
		root.channelStore.sendMessage(channelId, text)
	}

	const messageList = useMemo(() => {
		function shouldShowMessage(message: MessageState) {
			if (actualMode === "ads") {
				return message.type !== "normal" && message.type !== "action"
			}

			if (actualMode === "chat") {
				return message.type !== "lfrp"
			}

			return true
		}

		return <MessageList messages={messages.filter(shouldShowMessage)} />
	}, [actualMode, messages])

	return (
		<div className={`flex flex-col h-full`}>
			<ChannelHeader channelId={channelId} />

			<div className={`flex flex-row flex-1 min-h-0 my-1`}>
				<main className={`relative flex-1 bg-midnight-1`}>{messageList}</main>

				{isLargeScreen && (
					<div className={`w-56 min-h-0 ml-1`}>
						<ChannelUserList channel={channel} />
					</div>
				)}
			</div>

			<ChatInput
				value={chatInput}
				onChangeText={updateChatInput}
				onSubmit={submitChatInput}
			/>
		</div>
	)
}

export default ChannelView
