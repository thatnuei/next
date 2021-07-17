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

function openChatLogsDb() {
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

	getRoom(roomId: string): ChatLoggerRoom {
		return new ChatLoggerRoom(`${this.roomIdPrefix}:${roomId}`)
	}
}

export class ChatLoggerRoom {
	private readonly roomId: string

	constructor(roomId: string) {
		this.roomId = roomId
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
		for await (const message of this.iterateMessages(limit)) {
			messages.push(message)
		}
		return messages
	}

	private async *iterateMessages(limit: number): AsyncGenerator<MessageState> {
		const db = await openChatLogsDb()

		const transaction = db.transaction("messages", "readonly")

		let cursor = await transaction.store
			.index("roomId")
			.openCursor(IDBKeyRange.only(this.roomId), "next")

		for (let i = 0; i < limit && cursor != null; i++) {
			yield cursor.value
			cursor = await cursor.continue()
		}

		await transaction.done
	}
}
