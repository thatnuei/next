import { useObservable } from "micro-observables"
import { tw } from "twind"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import ChatInput from "../chat/ChatInput"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { useRootStore } from "../root/context"
import { usePrivateChat } from "./helpers"
import TypingStatusDisplay from "./TypingStatusDisplay"

type Props = {
	partnerName: string
} & TagProps<"div">

function PrivateChatView({ partnerName, ...props }: Props) {
	const root = useRootStore()
	const chat = usePrivateChat(partnerName)
	const messages = useObservable(chat.messages)
	const chatInput = useObservable(chat.chatInput)
	const typingStatus = useObservable(chat.typingStatus)

	return (
		<div className={tw`flex flex-col`} {...props}>
			<div className={tw`flex flex-row items-center h-20 bg-background-0`}>
				<ChatMenuButton className={tw`ml-3`} />

				<CharacterMenuTarget name={partnerName} className={tw`ml-3`}>
					<Avatar name={partnerName} className={tw`w-12 h-12`} />
				</CharacterMenuTarget>

				<div
					className={tw`flex flex-col self-stretch justify-center flex-1 ml-3 overflow-y-auto`}
				>
					{/* need this extra container to keep the children from shrinking */}
					<div className={tw`my-3`}>
						<CharacterName name={partnerName} />
						{/* the bottom margin needs to be here otherwise the scrolling flex column eats the bottom spacing */}
						<CharacterStatusText name={partnerName} className={tw`mb-3`} />
					</div>
				</div>
			</div>

			<div className={tw`flex flex-col flex-1 mb-gap`}>
				<TypingStatusDisplay
					name={partnerName}
					status={typingStatus}
					className={typingStatus === "clear" ? tw`h-gap` : ""}
				/>
				<MessageList
					messages={messages}
					className={tw`flex-1 bg-background-1`}
				/>
			</div>

			<ChatInput
				value={chatInput}
				onChangeText={(text) => chat.chatInput.set(text)}
				onSubmit={(text) => {
					chat.chatInput.set("")
					root.privateChatStore.sendMessage(partnerName, text)
				}}
			/>
		</div>
	)
}

export default PrivateChatView
