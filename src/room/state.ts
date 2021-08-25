import type { MessageState } from "../message/MessageState"

export type RoomState = {
  readonly messages: readonly MessageState[]
  readonly input: string
  readonly isUnread: boolean
}

const maxMessageCount = 500

export function createRoomState(): RoomState {
  return {
    messages: [],
    input: "",
    isUnread: false,
  }
}

export const addRoomMessage = <T extends RoomState>(
  room: T,
  message: MessageState,
): T => ({
  ...room,
  messages: [...room.messages, message].slice(-maxMessageCount),
})

export const clearRoomMessages = <T extends RoomState>(room: T): T => ({
  ...room,
  messages: [],
})

export const setRoomInput = <T extends RoomState>(
  room: T,
  input: string,
): T => ({
  ...room,
  input,
})

export const setRoomUnread = <T extends RoomState>(
  room: T,
  isUnread: boolean,
): T => ({
  ...room,
  isUnread,
})
