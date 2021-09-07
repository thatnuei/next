import type { MessageState } from "../message/MessageState"
import type { InputState } from "../state/input"
import { createInputState, setInputStateValue } from "../state/input"

export type RoomState = {
  readonly messages: readonly MessageState[]
  readonly input: InputState
  readonly isUnread: boolean
}

const maxMessageCount = 500

export function createRoomState(): RoomState {
  return {
    messages: [],
    isUnread: false,
    input: createInputState(),
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
  input: setInputStateValue(room.input, input),
})

export const setRoomUnread = <T extends RoomState>(
  room: T,
  isUnread: boolean,
): T => ({
  ...room,
  isUnread,
})
