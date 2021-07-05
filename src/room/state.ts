import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import type { MessageState } from "../message/MessageState"

export type RoomKey = string & { __isRoomKey: never }

export const roomMessagesAtom = atomFamily((key: RoomKey) =>
	atom<readonly MessageState[]>([]),
)

export const roomChatInputAtom = atomFamily((key: RoomKey) => atom<string>(""))

export const roomIsUnreadAtom = atomFamily((key: RoomKey) =>
	atom<boolean>(false),
)
