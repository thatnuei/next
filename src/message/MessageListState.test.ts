import { range } from "../helpers/common/range"
import { maxMessageCount, MessageListState } from "./MessageListState"
import { createChannelMessage } from "./MessageState"

it("stores a limited amount of messages, removing the older ones", async () => {
  const list = new MessageListState()
  const messageText = `awesome message`

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _n of range(maxMessageCount)) {
    list.add(createChannelMessage("Testificate", messageText))
  }

  list.add(createChannelMessage("Testificate", `${messageText} ayylmao`))

  expect(list.messages).toHaveLength(maxMessageCount)
  expect(list.messages[list.messages.length - 1].text).toContain("ayylmao")
})
