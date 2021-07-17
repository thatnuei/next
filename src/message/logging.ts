import type { DBSchema } from "idb"
import { openDB } from "idb"
import type { MessageState } from "./MessageState"

interface ChatLogDBSchema extends DBSchema {
	rooms: {
		key: string
		value: {
			id: string
			name: string
		}
	}
	messages: {
		key: number
		value: MessageState & {
			roomId: string
		}
		indexes: {
			roomId: "roomId"
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
	private readonly roomIdPrefix: string

	constructor(roomIdPrefix: string) {
		this.roomIdPrefix = roomIdPrefix
	}

	static withRoomPrefix(...args: ConstructorParameters<typeof ChatLogger>) {
		return new ChatLogger(...args)
	}

	async getRoom(roomId: string): Promise<ChatLoggerRoom> {
		const prefixedId = `${this.roomIdPrefix}:${roomId}`

		const db = await openChatLogsDb()

		let room = await db.get("rooms", prefixedId)
		if (!room) {
			room = { id: prefixedId, name: roomId }
			await db.add("rooms", room)
		}

		return new ChatLoggerRoom(room.id, room.name)
	}
}

export class ChatLoggerRoom {
	readonly roomId: string
	readonly roomName: string

	constructor(roomId: string, roomName: string) {
		this.roomId = roomId
		this.roomName = roomName
	}

	static async getAll(): Promise<ChatLoggerRoom[]> {
		const db = await openChatLogsDb()
		const rooms = await db.getAll("rooms")
		return rooms.map(({ id, name }) => new ChatLoggerRoom(id, name))
	}

	/**
	 * Updates the room name and returns an updated room
	 * @example
	 * const room = await logger.getRoom("roomId")
	 * const updatedRoom = await room.updateName("newName")
	 * // updatedRoom.roomName === "newName"
	 * // updatedRoom.roomId === "roomId"
	 */
	async setName(name: string): Promise<ChatLoggerRoom> {
		const db = await openChatLogsDb()
		await db.put("rooms", { id: this.roomId, name })
		return new ChatLoggerRoom(this.roomId, name)
	}

	async addMessage(message: MessageState) {
		const db = await openChatLogsDb()
		await db.add("messages", { ...message, roomId: this.roomId })
	}

	async getMessages(limit = Infinity): Promise<MessageState[]> {
		const db = await openChatLogsDb()

		const transaction = db.transaction("messages", "readonly")

		let cursor = await transaction.store
			.index("roomId")
			.openCursor(IDBKeyRange.only(this.roomId), "prev")

		const messages = []
		for (let i = 0; i < limit && cursor != null; i++) {
			messages.push(cursor.value)
			cursor = await cursor.continue()
		}
		return messages.reverse()
	}
}
