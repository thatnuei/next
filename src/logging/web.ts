import type { DBSchema } from "idb"
import { openDB } from "idb"
import type { MessageState } from "../message/MessageState"
import type { ChatLogger, LoggerRoom } from "./logger"

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

export function createWebChatLogger(): ChatLogger {
	return {
		getAllRooms: async () => {
			const db = await openChatLogsDb()
			return db.getAll("rooms")
		},

		getRoom: async (roomId) => {
			const db = await openChatLogsDb()
			return (await db.get("rooms", roomId)) ?? { id: roomId, name: roomId }
		},

		setRoomName: async (roomId, name) => {
			const db = await openChatLogsDb()
			await db.put("rooms", { id: roomId, name })
		},

		addMessage: async (roomId, message) => {
			const db = await openChatLogsDb()

			// create the room if it doesn't exist
			const room = await db.get("rooms", roomId)
			if (!room) {
				await db.put("rooms", { id: roomId, name: roomId })
			}

			await db.put("messages", { ...message, roomId })
		},

		getMessages: async (roomId, limit) => {
			const db = await openChatLogsDb()

			const transaction = db.transaction("messages", "readonly")

			let cursor = await transaction.store
				.index("roomId")
				.openCursor(IDBKeyRange.only(roomId), "prev")

			const messages = []
			for (let i = 0; i < limit && cursor != null; i++) {
				messages.push(cursor.value)
				cursor = await cursor.continue()
			}
			return messages.reverse()
		},
	}
}
