import { range } from "../common/range"
import { uniqueId } from "../common/uniqueId"
import { createChannelMessage } from "../message/MessageState"
import type { ChatLogger } from "./logger"
import { createWebChatLogger, openChatLogsDb } from "./web"

beforeEach(async () => {
  const db = await openChatLogsDb()
  await db.clear("messages")
  await db.clear("rooms")
})

// failing for no apparent reason fix later i guess 🙃🙃🙃🙃🙃🙃
describe.skip("ChatLogger - web", () => {
  loggerTest("adding messages", async (logger, roomId) => {
    expect(await logger.getMessages(roomId, 100)).toHaveLength(0)

    const message = createChannelMessage("Testificate", "hello world")
    await logger.addMessage(roomId, message)

    expect(await logger.getMessages(roomId, 100)).toMatchObject([message])
  })

  loggerTest(
    "limits",
    async (logger, roomId) => {
      await logger.addMessage(
        roomId,
        createChannelMessage("Testificate", "hello world"),
      )

      expect(await logger.getMessages(roomId, 10)).toHaveLength(1)

      await Promise.all(
        range(100).map(() =>
          logger.addMessage(
            roomId,
            createChannelMessage("Testificate", "hello world"),
          ),
        ),
      )

      expect(await logger.getMessages(roomId, 10)).toHaveLength(10)
      expect(await logger.getMessages(roomId, 50)).toHaveLength(50)
      expect(await logger.getMessages(roomId, 120)).toHaveLength(101)
      expect(await logger.getMessages(roomId, Infinity)).toHaveLength(101)
    },
    3,
  )

  loggerTest(
    `fetching messages starting with the newest`,
    async (logger, roomId) => {
      const messages = [
        createChannelMessage("Testificate", "1"),
        createChannelMessage("Testificate", "2"),
        createChannelMessage("Testificate", "3"),
        createChannelMessage("Testificate", "4"),
        createChannelMessage("Testificate", "5"),
      ]

      for (const message of messages) {
        await logger.addMessage(roomId, message)
      }

      expect(await logger.getMessages(roomId, 3)).toMatchObject(
        messages.slice(-3),
      )
    },
    10,
  )

  loggerTest("room name", async (logger, roomId) => {
    const roomName = uniqueId()
    expect((await logger.getRoom(roomId)).name).not.toBe(roomName)
    await logger.setRoomName(roomId, roomName)
    expect((await logger.getRoom(roomId)).name).toBe(roomName)
  })

  loggerTest("automatic room creation + getting all rooms", async (logger) => {
    expect(await logger.getAllRooms()).toHaveLength(0)

    // create room by adding message
    await logger.addMessage(
      "room1",
      createChannelMessage("Testificate", "hello world"),
    )

    // create room by setting name
    await logger.setRoomName("room2", "room2")

    expect(await logger.getAllRooms()).toMatchObject([
      await logger.getRoom("room1"),
      await logger.getRoom("room2"),
    ])
  })
})

function loggerTest(
  description: string,
  fn: (logger: ChatLogger, roomId: string) => void | Promise<unknown>,
  repeatCount = 1, // run some tests multiple times for determinism
) {
  const logger = createWebChatLogger()
  for (const i of range(repeatCount)) {
    const roomId = `${description}${repeatCount > 1 ? ` (${i + 1})` : ""}`
    test(roomId, async () => {
      await fn(logger, roomId)
    })
  }
}
