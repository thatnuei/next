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
	const { messages, input, typingStatus } = usePrivateChat(partnerName)
	const privateChatActions = usePrivateChatActions(partnerName)

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-row items-center h-20 gap-3 px-3 mb-1 bg-midnight-0">
				<ChatMenuButton />

				<CharacterMenuTarget name={partnerName}>
					<Avatar name={partnerName} size={12} />
				</CharacterMenuTarget>

				<div className="flex flex-col self-stretch justify-center flex-1 overflow-y-auto">
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
				<div className="flex-1 bg-midnight-1">
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
