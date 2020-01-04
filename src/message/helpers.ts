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
