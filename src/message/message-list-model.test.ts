import { range } from "../common/range"
import { createMessageListState, maxMessageCount } from "./message-list-state"
import { createChannelMessage } from "./message-state"

it("stores a limited amount of messages, removing the older ones", async () => {
  const list = createMessageListState()
  const messageText = `awesome message`

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const n of range(maxMessageCount)) {
    list.add(createChannelMessage("Testificate", messageText))
  }

  list.add(createChannelMessage("Testificate", `${messageText} ayylmao`))

  expect(list.messages).toHaveLength(maxMessageCount)
  expect(list.messages[list.messages.length - 1].text).toContain("ayylmao")
})
