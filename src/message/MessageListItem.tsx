import { memo } from "react"
import BBC from "../bbc/BBC"
import CharacterName from "../character/CharacterName"
import type { OptionalKeys } from "../common/types"
import Timestamp from "../dom/Timestamp"
import type { MessageState } from "./MessageState"

type Props = {
  message: OptionalKeys<MessageState, "timestamp">
}

function MessageListItem({ message }: Props) {
  return (
    <div>
      {message.timestamp ? (
        <Timestamp className="inline-block mr-2 text-sm not-italic opacity-50">
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

export default memo(MessageListItem)
