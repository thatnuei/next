import { range } from "../common/range"
import { maxMessageCount, MessageListModel } from "./MessageListModel"

describe("MessageListModel", () => {
  it("stores a limited amount of messages, removing the older ones", async () => {
    const list = new MessageListModel()
    const messageText = `awesome message`

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const n of range(maxMessageCount)) {
      list.add(undefined, messageText, "normal", Date.now())
    }

    list.add(undefined, `${messageText} ayylmao`, "normal", Date.now())

    expect(list.items).toHaveLength(maxMessageCount)
    expect(list.items[list.items.length - 1].text).toContain("ayylmao")
  })
})
