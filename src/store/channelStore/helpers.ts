import createUniqueId from "../../common/helpers/createUniqueId"
import { Channel, Message, MessageType } from "./types"

export function createChannel(id: string): Channel {
  return {
    id,
    title: "",
    messages: [],
    chatboxInput: "",
    isUnread: false,
    description: "",
    mode: "chat",
    selectedMode: "chat",
    memberNames: [],
    opNames: [],
    joining: false,
  }
}

export function createMessage(
  senderName: string,
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
