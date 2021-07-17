import { range } from "../common/range"
import type { ChatLoggerRoom } from "./logging"
import { ChatLogger } from "./logging"
import { createChannelMessage } from "./MessageState"

describe("ChatLogger", () => {
	loggerTest("adding messages", async (room) => {
		expect(await room.getMessages(100)).toHaveLength(0)

		const message = createChannelMessage("Testificate", "hello world")
		await room.addMessage("Test Room", message)

		expect(await room.getMessages(100)).toMatchObject([message])
	})

	loggerTest("limits", async (room) => {
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

	loggerTest(
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
		20,
	)
})

function loggerTest(
	description: string,
	fn: (room: ChatLoggerRoom) => void,
	repeatCount = 1, // run some tests multiple times for determinism
) {
	const logger = ChatLogger.create("test")
	test(description, () => {
		for (let i = 0; i < repeatCount; i++) {
			const room = logger.getRoom(`${description} (${i})`)
			fn(room)
		}
	})
}
