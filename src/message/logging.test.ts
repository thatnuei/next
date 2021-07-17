import { range } from "../common/range"
import { ChatLogger } from "./logging"
import { createChannelMessage } from "./MessageState"

describe("ChatLogger", () => {
	test("adding messages", async () => {
		const logger = ChatLogger.create({
			roomIdPrefix: "test",
		})

		const roomId = "adding-messages"

		expect(await logger.getMessages(roomId, 100)).toHaveLength(0)

		const message = createChannelMessage("Testificate", "hello world")
		await logger.addMessage(roomId, "Test Room", message)

		expect(await logger.getMessages(roomId, 100)).toMatchObject([message])
	})

	test("limits", async () => {
		const logger = ChatLogger.create({
			roomIdPrefix: "test",
		})

		const roomId = "limits"

		logger.addMessage(
			roomId,
			"Test Room",
			createChannelMessage("Testificate", "hello world"),
		)

		expect(await logger.getMessages(roomId, 10)).toHaveLength(1)

		await Promise.all(
			range(100).map(() =>
				logger.addMessage(
					roomId,
					"Test Room",
					createChannelMessage("Testificate", "hello world"),
				),
			),
		)

		expect(await logger.getMessages(roomId, 10)).toHaveLength(10)
		expect(await logger.getMessages(roomId, 50)).toHaveLength(50)
		expect(await logger.getMessages(roomId, 120)).toHaveLength(101)
	})

	test("fetching messages starting with the newest", async () => {
		async function runTest(index: number) {
			const logger = ChatLogger.create({
				roomIdPrefix: "test",
			})

			const roomId = `fetching-messages-starting-with-the-newest-${index}`

			const messages = [
				createChannelMessage("Testificate", "first"),
				createChannelMessage("Testificate", "second"),
				createChannelMessage("Testificate", "third"),
			]

			for (const message of messages) {
				await logger.addMessage(roomId, "Test Room", message)
			}

			expect(await logger.getMessages(roomId, 10)).toMatchObject(messages)
		}

		// run multiple times for determinism
		for (let i = 0; i < 20; i++) {
			await runTest(i)
		}
	})
})
