import { tw } from "twind"
import BBC from "../bbc/BBC"
import CharacterName from "../character/CharacterName"
import { MessageState } from "./MessageState"

type Props = {
	message: MessageState
}

function MessageListItem({ message }: Props) {
	const typeStyle = {
		normal: undefined,
		action: tw`italic`,
		lfrp: tw`bg-green-500 bg-opacity-20`,
		warning: tw`bg-red-500 bg-opacity-20`,
		system: tw`bg-black bg-opacity-50`,
	}[message.type]

	return (
		<div tw={`${typeStyle} px-2 py-1`}>
			<span tw="inline-block float-right text-sm not-italic opacity-50">
				{new Date(message.timestamp).toLocaleTimeString()}
			</span>

			{message.senderName && (
				<span
					tw={`inline-block ${message.type === "action" ? tw`mr-1` : tw`mr-2`}`}
				>
					<CharacterName name={message.senderName} />
				</span>
			)}

			<BBC text={message.text} />
		</div>
	)
}

export default MessageListItem
