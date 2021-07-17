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

	static create(...args: ConstructorParameters<typeof ChatLogger>) {
		return new ChatLogger(...args)
	}

	async getRoom(roomId: string, roomName: string): Promise<ChatLoggerRoom> {
		const prefixedId = `${this.roomIdPrefix}:${roomId}`

		const db = await openChatLogsDb()

		const room = (await db.get("rooms", prefixedId)) ?? {
			id: prefixedId,
			name: roomName,
		}

		return new ChatLoggerRoom(room.id, room.name)
	}

	// eslint-disable-next-line class-methods-use-this
	async getAllRooms(): Promise<ChatLoggerRoom[]> {
		const db = await openChatLogsDb()
		const rooms = await db.getAll("rooms")
		return rooms.map(({ id, name }) => new ChatLoggerRoom(id, name))
	}
}

export class ChatLoggerRoom {
	readonly roomId: string
	readonly roomName: string

	constructor(roomId: string, roomName: string) {
		this.roomId = roomId
		this.roomName = roomName
	}

	async addMessage(roomName: string, message: MessageState) {
		const db = await openChatLogsDb()

		const transaction = db.transaction(["rooms", "messages"], "readwrite")
		const roomsStore = transaction.objectStore("rooms")
		const messagesStore = transaction.objectStore("messages")

		roomsStore.put({
			id: this.roomId,
			name: roomName,
		})

		messagesStore.add({
			...message,
			roomId: this.roomId,
		})

		await transaction.done
	}

	async getMessages(limit: number): Promise<MessageState[]> {
		const messages = []

		const db = await openChatLogsDb()

		const transaction = db.transaction("messages", "readonly")

		let cursor = await transaction.store
			.index("roomId")
			.openCursor(IDBKeyRange.only(this.roomId), "next")

		for (let i = 0; i < limit && cursor != null; i++) {
			messages.push(cursor.value)
			cursor = await cursor.continue()
		}

		await transaction.done

		return messages
	}
}
