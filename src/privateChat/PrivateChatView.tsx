import { useEffect, useMemo } from "react"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import ChatInput from "../chat/ChatInput"
import ChatMenuButton from "../chat/ChatMenuButton"
import MessageList from "../message/MessageList"
import { usePrivateChat, usePrivateChatActions } from "./state"
import TypingStatusDisplay from "./TypingStatusDisplay"

interface Props {
	partnerName: string
}

function PrivateChatView({ partnerName }: Props) {
	const { input, typingStatus, ...chat } = usePrivateChat(partnerName)
	const privateChatActions = usePrivateChatActions(partnerName)

	const messages = useMemo(
		() => [...(chat.previousMessages ?? []), ...chat.messages],
		[chat.previousMessages, chat.messages],
	)

	useEffect(() => {
		if (chat.isUnread) privateChatActions.markRead()
	}, [chat.isUnread, privateChatActions])

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

			<div className="flex flex-col flex-1 mb-1">
				<TypingStatusDisplay name={partnerName} status={typingStatus} />
				<div className="bg-midnight-1 flex-1">
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
			/>
		</div>
	)
}

export default PrivateChatView
