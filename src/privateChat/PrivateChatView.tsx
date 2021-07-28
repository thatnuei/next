import { useEffect, useMemo } from "react"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import ChatInput from "../chat/ChatInput"
import ChatMenuButton from "../chat/ChatMenuButton"
import { useDocumentVisible } from "../dom/useDocumentVisible"
import MessageList from "../message/MessageList"
import MessageListItem from "../message/MessageListItem"
import { createPrivateMessage } from "../message/MessageState"
import { useSocketActions } from "../socket/SocketConnection"
import { useIdentity } from "../user"
import { usePrivateChat, usePrivateChatActions } from "./state"
import TypingStatusDisplay from "./TypingStatusDisplay"

interface Props {
	partnerName: string
}

function PrivateChatView({ partnerName }: Props) {
	const { input, typingStatus, ...chat } = usePrivateChat(partnerName)
	const privateChatActions = usePrivateChatActions(partnerName)
	const socketActions = useSocketActions()
	const identity = useIdentity() || "unknown"

	const messages = useMemo(
		() => [...(chat.previousMessages ?? []), ...chat.messages],
		[chat.previousMessages, chat.messages],
	)

	const isDocumentVisible = useDocumentVisible()
	useEffect(() => {
		if (chat.isUnread && isDocumentVisible) privateChatActions.markRead()
	}, [chat.isUnread, isDocumentVisible, privateChatActions])

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-row bg-midnight-0 h-20 mb-1 px-3 gap-3 items-center">
				<ChatMenuButton />

				<CharacterMenuTarget name={partnerName}>
					<Avatar name={partnerName} size={12} />
				</CharacterMenuTarget>

				<div className="flex flex-col flex-1 self-stretch justify-center overflow-y-auto">
					{/* need this extra container to keep the children from shrinking */}
					<div className="my-3">
						<CharacterName name={partnerName} statusDot="hidden" />
						<CharacterStatusText name={partnerName} />
						{/* this spacer needs to be here, otherwise the scrolling flex column eats the bottom spacing */}
						<div className="h-3" />
					</div>
				</div>
			</div>

			{/* min height 0 needed on both places here to not overstretch the parent */}
			<div className="flex flex-col flex-1 mb-1 min-h-0">
				<TypingStatusDisplay name={partnerName} status={typingStatus} />
				<div className="bg-midnight-1 flex-1 min-h-0">
					<MessageList messages={messages} />
				</div>
			</div>

			<ChatInput
				value={input}
				maxLength={50000}
				onChangeText={privateChatActions.setInput}
				onSubmit={(message) => {
					privateChatActions.sendMessage(message)
					privateChatActions.setInput("")
				}}
				onTypingStatusChange={(status) => {
					socketActions.send({
						type: "TPN",
						params: {
							character: partnerName,
							status,
						},
					})
				}}
				renderPreview={(value) => (
					<MessageListItem
						message={{
							...createPrivateMessage(identity, value),
							timestamp: undefined,
						}}
					/>
				)}
			/>
		</div>
	)
}

export default PrivateChatView
