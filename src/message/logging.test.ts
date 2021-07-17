import { range } from "../common/range"
import { uniqueId } from "../common/uniqueId"
import { ChatLogger, ChatLoggerRoom, openChatLogsDb } from "./logging"
import { createChannelMessage } from "./MessageState"

beforeEach(async () => {
	const db = await openChatLogsDb()
	await db.clear("messages")
	await db.clear("rooms")
})

describe("ChatLogger", () => {
	roomTest("adding messages", async (room) => {
		expect(await room.getMessages(100)).toHaveLength(0)

		const message = createChannelMessage("Testificate", "hello world")
		await room.addMessage(message)

		expect(await room.getMessages(100)).toMatchObject([message])
	})

	roomTest(
		"limits",
		async (room) => {
			room.addMessage(createChannelMessage("Testificate", "hello world"))

			expect(await room.getMessages(10)).toHaveLength(1)

			await Promise.all(
				range(100).map(() =>
					room.addMessage(createChannelMessage("Testificate", "hello world")),
				),
			)

			expect(await room.getMessages(10)).toHaveLength(10)
			expect(await room.getMessages(50)).toHaveLength(50)
			expect(await room.getMessages(120)).toHaveLength(101)
			expect(await room.getMessages()).toHaveLength(101)
		},
		3,
	)

	roomTest(
		`fetching messages starting with the newest`,
		async (room) => {
			const messages = [
				createChannelMessage("Testificate", "1"),
				createChannelMessage("Testificate", "2"),
				createChannelMessage("Testificate", "3"),
				createChannelMessage("Testificate", "4"),
				createChannelMessage("Testificate", "5"),
			]

			for (const message of messages) {
				await room.addMessage(message)
			}

			expect(await room.getMessages(3)).toMatchObject(messages.slice(-3))
		},
		10,
	)

	roomTest("room name", async (room) => {
		const roomName = uniqueId()
		expect(room.roomName).not.toBe(roomName)
		room = await room.setName(roomName)
		expect(room.roomName).toBe(roomName)
	})

	test("getting all rooms", async () => {
		expect(await ChatLoggerRoom.getAll()).toHaveLength(0)

		const logger = ChatLogger.withRoomPrefix("test")

		const room1 = await logger.getRoom("room1")
		await room1.setName("first room")
		await room1.addMessage(createChannelMessage("Testificate", "hello world"))

		const room2 = await logger.getRoom("room2")
		await room2.setName("second room")
		await room2.addMessage(createChannelMessage("Testificate", "hello world"))

		expect(await ChatLoggerRoom.getAll()).toMatchObject([
			await logger.getRoom("room1"),
			await logger.getRoom("room2"),
		])
	})
})

function roomTest(
	description: string,
	fn: (room: ChatLoggerRoom) => void | Promise<unknown>,
	repeatCount = 1, // run some tests multiple times for determinism
) {
	const logger = ChatLogger.withRoomPrefix("test")
	for (let i = 0; i < repeatCount; i++) {
		test(`${description}${repeatCount > 1 ? ` (${i + 1})` : ""}`, async () => {
			await fn(await logger.getRoom(`${description} (${i})`))
		})
	}
}
