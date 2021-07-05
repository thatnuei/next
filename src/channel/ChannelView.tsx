import { useMemo } from "react"
import ChatInput from "../chat/ChatInput"
import { useMediaQuery } from "../dom/useMediaQuery"
import MessageList from "../message/MessageList"
import type { MessageState } from "../message/MessageState"
import { screenQueries } from "../ui/screens"
import ChannelHeader from "./ChannelHeader"
import ChannelUserList from "./ChannelUserList"
import {
	useActualChannelMode,
	useChannel,
	useChannelActions,
	useChannelMessages,
} from "./state"

interface Props {
	channelId: string
}

function ChannelView({ channelId }: Props) {
	const channel = useChannel(channelId)
	const messages = useChannelMessages(channelId)
	const actualMode = useActualChannelMode(channelId)
	const { sendMessage, updateChannel } = useChannelActions()
	const isLargeScreen = useMediaQuery(screenQueries.large)

	function updateChatInput(chatInput: string) {
		void updateChannel({ id: channelId, chatInput })
	}

	function submitChatInput(text: string) {
		sendMessage(channelId, text)
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

			<div className={`flex flex-1 min-h-0 my-1`}>
				<main className={`relative flex-1 bg-midnight-1`}>{messageList}</main>

				{isLargeScreen && (
					<div className={`w-56 min-h-0 ml-1`}>
						<ChannelUserList channelId={channelId} />
					</div>
				)}
			</div>

			<ChatInput
				value={channel.chatInput}
				onChangeText={updateChatInput}
				onSubmit={submitChatInput}
			/>
		</div>
	)
}

export default ChannelView
