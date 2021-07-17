import { range } from "../common/range"
import { uniqueId } from "../common/uniqueId"
import { createChannelMessage } from "../message/MessageState"
import { ChatLogger, openChatLogsDb } from "./logger"

beforeEach(async () => {
	const db = await openChatLogsDb()
	await db.clear("messages")
	await db.clear("rooms")
})

describe("ChatLogger", () => {
	roomTest("adding messages", async (logger) => {
		expect(await logger.getMessages(100)).toHaveLength(0)

		const message = createChannelMessage("Testificate", "hello world")
		await logger.addMessage(message)

		expect(await logger.getMessages(100)).toMatchObject([message])
	})

	roomTest(
		"limits",
		async (logger) => {
			logger.addMessage(createChannelMessage("Testificate", "hello world"))

			expect(await logger.getMessages(10)).toHaveLength(1)

			await Promise.all(
				range(100).map(() =>
					logger.addMessage(createChannelMessage("Testificate", "hello world")),
				),
			)

			expect(await logger.getMessages(10)).toHaveLength(10)
			expect(await logger.getMessages(50)).toHaveLength(50)
			expect(await logger.getMessages(120)).toHaveLength(101)
			expect(await logger.getMessages()).toHaveLength(101)
		},
		3,
	)

	roomTest(
		`fetching messages starting with the newest`,
		async (logger) => {
			const messages = [
				createChannelMessage("Testificate", "1"),
				createChannelMessage("Testificate", "2"),
				createChannelMessage("Testificate", "3"),
				createChannelMessage("Testificate", "4"),
				createChannelMessage("Testificate", "5"),
			]

			for (const message of messages) {
				await logger.addMessage(message)
			}

			expect(await logger.getMessages(3)).toMatchObject(messages.slice(-3))
		},
		10,
	)

	roomTest("room name", async (logger) => {
		const roomName = uniqueId()
		expect(logger.room.name).not.toBe(roomName)
		logger = await logger.setRoomName(roomName)
		expect(logger.room.name).toBe(roomName)
	})

	test("getting all rooms", async () => {
		expect(await ChatLogger.getAll()).toHaveLength(0)

		const getRoom = ChatLogger.factoryWithPrefix("test")

		const room1 = await getRoom("room1")
		await room1.setRoomName("first room")
		await room1.addMessage(createChannelMessage("Testificate", "hello world"))

		const room2 = await getRoom("room2")
		await room2.setRoomName("second room")
		await room2.addMessage(createChannelMessage("Testificate", "hello world"))

		expect(await ChatLogger.getAll()).toMatchObject([
			await getRoom("room1"),
			await getRoom("room2"),
		])
	})
})

function roomTest(
	description: string,
	fn: (logger: ChatLogger) => void | Promise<unknown>,
	repeatCount = 1, // run some tests multiple times for determinism
) {
	const getLogger = ChatLogger.factoryWithPrefix("test")
	for (let i = 0; i < repeatCount; i++) {
		test(`${description}${repeatCount > 1 ? ` (${i + 1})` : ""}`, async () => {
			await fn(await getLogger(`${description} (${i})`))
		})
	}
}
