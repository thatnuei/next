import clsx from "clsx"
import BBC from "../bbc/BBC"
import CharacterName from "../character/CharacterName"
import type { OptionalKeys } from "../common/types"
import Timestamp from "../dom/Timestamp"
import type { MessageState } from "./MessageState"

type Props = {
  message: OptionalKeys<MessageState, "timestamp">
}

function MessageListItem({ message }: Props) {
  const typeStyle = {
    normal: undefined,
    action: `italic`,
    lfrp: `bg-green-500/20`,
    warning: `bg-red-500/20`,
    system: `bg-black/50`,
  }[message.type]

  return (
    <div className={clsx(typeStyle, "px-2 py-1")}>
      {message.timestamp ? (
        <Timestamp className="text-sm mr-2 opacity-50 not-italic inline-block">
          {message.timestamp}
        </Timestamp>
      ) : undefined}

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
