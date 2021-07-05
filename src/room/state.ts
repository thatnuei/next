import { atomFamily } from "recoil"
import type { MessageState } from "../message/MessageState"

export type RoomKey = string & { __isRoomKey: never }

export const roomMessagesAtom = atomFamily({
	key: "roomMessages",
	default: (key: RoomKey): readonly MessageState[] => [],
})

export const roomChatInputAtom = atomFamily({
	key: "roomChatInput",
	default: (key: RoomKey): string => "",
})

export const roomIsUnreadAtom = atomFamily({
	key: "roomIsUnread",
	default: (key: RoomKey): boolean => false,
})
