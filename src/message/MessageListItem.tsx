import BBC from "../bbc/BBC"
import CharacterName from "../character/CharacterName"
import { MessageState } from "./MessageState"

type Props = {
	message: MessageState
}

function MessageListItem({ message }: Props) {
	const typeStyle = {
		normal: undefined,
		action: `italic`,
		lfrp: `bg-green-500 bg-opacity-20`,
		warning: `bg-red-500 bg-opacity-20`,
		system: `bg-black bg-opacity-50`,
	}[message.type]

	return (
		<div className={`${typeStyle} px-2 py-1`}>
			<span className="inline-block float-right ml-2 text-sm not-italic opacity-50">
				{new Date(message.timestamp).toLocaleTimeString()}
			</span>

			{message.senderName && (
				<span
					className={`inline-block ${
						message.type === "action" ? `mr-1` : `mr-2`
					}`}
				>
					<CharacterName name={message.senderName} />
				</span>
			)}

			<BBC text={message.text} />
		</div>
	)
}

export default MessageListItem
