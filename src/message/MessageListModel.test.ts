import { range } from "../common/range"
import { maxMessageCount, MessageListModel } from "./MessageListModel"
import { MessageModel } from "./MessageModel"

describe("MessageListModel", () => {
  it("stores a limited amount of messages, removing the older ones", async () => {
    const list = new MessageListModel()
    const messageText = `awesome message`

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const n of range(maxMessageCount)) {
      list.add(MessageModel.fromChannelMessage("Testificate", messageText))
    }

    list.add(
      MessageModel.fromChannelMessage("Testificate", `${messageText} ayylmao`),
    )

    expect(list.items).toHaveLength(maxMessageCount)
    expect(list.items[list.items.length - 1].text).toContain("ayylmao")
  })
})
