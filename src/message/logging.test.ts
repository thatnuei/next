import { range } from "../common/range"
import type { ChatLoggerRoom } from "./logging"
import { ChatLogger, openChatLogsDb } from "./logging"
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
		await room.addMessage("Test Room", message)

		expect(await room.getMessages(100)).toMatchObject([message])
	})

	roomTest("limits", async (room) => {
		room.addMessage(
			"Test Room",
			createChannelMessage("Testificate", "hello world"),
		)

		expect(await room.getMessages(10)).toHaveLength(1)

		await Promise.all(
			range(100).map(() =>
				room.addMessage(
					"Test Room",
					createChannelMessage("Testificate", "hello world"),
				),
			),
		)

		expect(await room.getMessages(10)).toHaveLength(10)
		expect(await room.getMessages(50)).toHaveLength(50)
		expect(await room.getMessages(120)).toHaveLength(101)
	})

	roomTest(
		`fetching messages starting with the newest`,
		async (room) => {
			const messages = [
				createChannelMessage("Testificate", "first"),
				createChannelMessage("Testificate", "second"),
				createChannelMessage("Testificate", "third"),
			]

			for (const message of messages) {
				await room.addMessage("Test Room", message)
			}

			expect(await room.getMessages(10)).toMatchObject(messages)
		},
		10,
	)

	test("get all rooms", async () => {
		const logger = ChatLogger.create("test")
		expect(await logger.getAllRooms()).toHaveLength(0)

		const room1 = await logger.getRoom("room1", "first")
		await room1.addMessage(
			"first",
			createChannelMessage("Testificate", "hello world"),
		)

		const room2 = await logger.getRoom("room2", "second")
		await room2.addMessage(
			"first",
			createChannelMessage("Testificate", "hello world"),
		)

		expect(await logger.getAllRooms()).toMatchObject([
			logger.getRoom("room1", "first"),
			logger.getRoom("room2", "second"),
		])
	})
})

function roomTest(
	description: string,
	fn: (room: ChatLoggerRoom) => void | Promise<unknown>,
	repeatCount = 1, // run some tests multiple times for determinism
) {
	const logger = ChatLogger.create("test")
	for (let i = 0; i < repeatCount; i++) {
		test(`${description}${repeatCount > 1 ? ` (${i + 1})` : ""}`, async () => {
			const room = await logger.getRoom(`${description} (${i})`, "Test Room")
			await fn(room)
		})
	}
}
