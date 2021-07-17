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

interface ChatLoggerOptions {
	roomIdPrefix: string
}

export class ChatLogger {
	private readonly options: ChatLoggerOptions

	private constructor(options: ChatLoggerOptions) {
		this.options = options
	}

	static create(options: ChatLoggerOptions) {
		return new ChatLogger(options)
	}

	private getPrefixedId(roomId: string) {
		return `${this.options.roomIdPrefix}:${roomId}`
	}

	async addMessage(roomId: string, roomName: string, message: MessageState) {
		const db = await openChatLogsDb()

		const transaction = db.transaction(["rooms", "messages"], "readwrite")
		const roomsStore = transaction.objectStore("rooms")
		const messagesStore = transaction.objectStore("messages")

		roomsStore.put({
			id: this.getPrefixedId(roomId),
			name: roomName,
		})

		messagesStore.add({
			...message,
			roomId: this.getPrefixedId(roomId),
		})

		await transaction.done
	}

	private async *iterateMessages(
		roomId: string,
		limit: number,
	): AsyncGenerator<MessageState> {
		const db = await openChatLogsDb()

		const transaction = db.transaction("messages", "readonly")

		let cursor = await transaction.store
			.index("roomId")
			.openCursor(IDBKeyRange.only(this.getPrefixedId(roomId)), "next")

		for (let i = 0; i < limit && cursor != null; i++) {
			yield cursor.value
			cursor = await cursor.continue()
		}

		await transaction.done
	}

	async getMessages(roomId: string, limit: number): Promise<MessageState[]> {
		const messages = []
		for await (const message of this.iterateMessages(roomId, limit)) {
			messages.push(message)
		}
		return messages
	}
}
