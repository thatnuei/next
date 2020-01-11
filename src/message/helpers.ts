import createUniqueId from "../common/helpers/createUniqueId"
import { Message, MessageType } from "./types"

export function createMessage(
  senderName: string | undefined,
  text: string,
  type: MessageType,
): Message {
  return {
    id: createUniqueId(),
    time: Date.now(),
    senderName,
    text,
    type,
  }
}

export function addMessage(
  roomLike: { messages: Message[] },
  message: Message,
) {
  const length = roomLike.messages.push(message)
  roomLike.messages.splice(0, 300 - length)
}
