import type { DBSchema } from "idb"
import { openDB } from "idb"
import type { MessageState } from "../message/MessageState"

interface LoggerRoom {
	readonly id: string
	readonly name: string
}

interface ChatLogDBSchema extends DBSchema {
	readonly rooms: {
		readonly key: string
		readonly value: LoggerRoom
	}
	readonly messages: {
		readonly key: number
		readonly value: MessageState & {
			readonly roomId: string
		}
		readonly indexes: {
			readonly roomId: "roomId"
		}
	}
}

export function openChatLogsDb() {
	return openDB<ChatLogDBSchema>("chat-logs", 1, {
		upgrade(db) {
			db.createObjectStore("rooms", { keyPath: "id" })

			const messageStore = db.createObjectStore("messages", {
				autoIncrement: true,
			})
			messageStore.createIndex("roomId", "roomId")
		},
	})
}

export class ChatLogger {
	readonly room: LoggerRoom

	private constructor(room: LoggerRoom) {
		this.room = room
	}

	static async load(roomId: string): Promise<ChatLogger> {
		const db = await openChatLogsDb()

		let room = await db.get("rooms", roomId)
		if (!room) {
			room = { id: roomId, name: roomId }
			await db.add("rooms", room)
		}

		return new ChatLogger(room)
	}

	static async getAll(): Promise<ChatLogger[]> {
		const db = await openChatLogsDb()
		const rooms = await db.getAll("rooms")
		return rooms.map((room) => new ChatLogger(room))
	}

	/**
	 * Creates a factory function which will create a room with a given prefix for IDs.
	 * Helps for cases where different types of rooms can have the same ID
	 *
	 * e.g. there's a room called "Frontpage",
	 * but someone's character also might be named "Frontpage"
	 *
	 * Without a room prefix, messages from that global room
	 * and that character would be stored in the same place
	 */
	static factoryWithPrefix(prefix: string) {
		return async function loadRoom(roomId: string) {
			return ChatLogger.load(`${prefix}:${roomId}`)
		}
	}

	/**
	 * Updates the room name and returns an updated room
	 * @example
	 * const room = await logger.getRoom("roomId")
	 * const updatedRoom = await room.updateName("newName")
	 * // updatedRoom.roomName === "newName"
	 * // updatedRoom.roomId === "roomId"
	 */
	async setRoomName(name: string): Promise<ChatLogger> {
		const db = await openChatLogsDb()
		const newRoom = { ...this.room, name }
		await db.put("rooms", newRoom)
		return new ChatLogger(newRoom)
	}

	async addMessage(message: MessageState) {
		const db = await openChatLogsDb()
		await db.add("messages", { ...message, roomId: this.room.id })
	}

	async getMessages(limit = Infinity): Promise<MessageState[]> {
		const db = await openChatLogsDb()

		const transaction = db.transaction("messages", "readonly")

		let cursor = await transaction.store
			.index("roomId")
			.openCursor(IDBKeyRange.only(this.room.id), "prev")

		const messages = []
		for (let i = 0; i < limit && cursor != null; i++) {
			messages.push(cursor.value)
			cursor = await cursor.continue()
		}
		return messages.reverse()
	}
}
