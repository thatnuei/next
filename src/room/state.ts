import type { Draft } from "immer"
import produce from "immer"
import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import type { Dict } from "../common/types"
import type { MessageState } from "../message/MessageState"

// room state
export interface RoomState {
	readonly messages: readonly MessageState[]
	readonly input: string
	readonly isUnread: boolean
}

function createRoomState(): RoomState {
	return {
		messages: [],
		input: "",
		isUnread: false,
	}
}

type RoomKey = string & { __isRoomKey: never }
export const roomKey = (key: string) => key as RoomKey

const maxMessageCount = 500

const roomsAtom = atom<Dict<RoomState>>({})

export function useRoomState(key: RoomKey): RoomState {
	const rooms = useAtomValue(roomsAtom)
	const fallbackRoom = useMemo(() => createRoomState(), [])
	return rooms[key] ?? fallbackRoom
}

export function useRoomActions() {
	const setRooms = useUpdateAtom(roomsAtom)

	const updateRoom = (
		key: RoomKey,
		mutate: (room: Draft<RoomState>) => void,
	) => {
		setRooms(
			produce((rooms) => {
				const room = (rooms[key] ??= createRoomState() as Draft<RoomState>)
				mutate(room)
			}),
		)
	}

	const addMessage = (key: RoomKey, message: MessageState) => {
		updateRoom(key, (room) => {
			room.messages = [...room.messages, message].slice(-maxMessageCount)
		})
	}

	const clearMessages = (key: RoomKey) => {
		updateRoom(key, (room) => {
			room.messages = []
		})
	}

	const setInput = (key: RoomKey, input: string) => {
		updateRoom(key, (room) => {
			room.input = input
		})
	}

	const setUnread = (key: RoomKey, isUnread: boolean) => {
		updateRoom(key, (room) => {
			room.isUnread = isUnread
		})
	}

	return {
		addMessage,
		clearMessages,
		setInput,
		setUnread,
	}
}
