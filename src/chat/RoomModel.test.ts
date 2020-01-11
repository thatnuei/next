import { RoomModel } from "./RoomModel"

describe("RoomModel", () => {
  it("limits messages to a given limit", () => {
    const model = new RoomModel()
    for (let i = 0; i <= RoomModel.messageLimit; i++) {
      model.addMessage("Testificate", "hi", "chat")
    }

    expect(model.messages.length === RoomModel.messageLimit)

    const lastMessages = [
      model.addMessage("Testificate", "hello", "chat"),
      model.addMessage("Testificate", "hi", "chat"),
      model.addMessage("Testificate", "test", "chat"),
    ]

    expect(model.messages.length === RoomModel.messageLimit)
    expect(model.messages.slice(-3)).toEqual(lastMessages)
  })
})
