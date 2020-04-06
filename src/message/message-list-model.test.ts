import { range } from "../common/range"
import { createMessageListModel, maxMessageCount } from "./message-list-model"
import { createChannelMessage } from "./message-model"

it("stores a limited amount of messages, removing the older ones", async () => {
  const list = createMessageListModel()
  const messageText = `awesome message`

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const n of range(maxMessageCount)) {
    list.add(createChannelMessage("Testificate", messageText))
  }

  list.add(createChannelMessage("Testificate", `${messageText} ayylmao`))

  expect(list.messages).toHaveLength(maxMessageCount)
  expect(list.messages[list.messages.length - 1].text).toContain("ayylmao")
})
