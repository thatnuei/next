import { render } from "@testing-library/react"
import React from "react"
import RootStore, { RootStoreContext } from "../RootStore"
import Message from "./Message"
import MessageModel from "./MessageModel"

describe(Message.name, () => {
  const store = new RootStore()

  const message = new MessageModel("Testificate", "hi there", "chat")

  const setup = (extra: Partial<MessageModel> = {}) =>
    render(
      <RootStoreContext.Provider value={store}>
        <Message {...message} {...extra} />
      </RootStoreContext.Provider>,
    )

  it("shows the sender name", () => {
    const { queryByText } = setup()
    expect(queryByText(message.senderName!)).not.toBeNull()
  })

  it("shows the message", () => {
    const { queryByText } = setup()
    expect(queryByText(message.text)).not.toBeNull()
  })

  it("shows the timestamp", () => {
    const { queryByText } = setup()
    // show the time in any capacity, must show seconds
    expect(queryByText(/\d:\d\d:\d\d/)).not.toBeNull()
  })

  it("removes /me from action messages", () => {
    const { getByText } = setup({ text: "/me does a thing" })
    const el = getByText("does a thing")
    expect(el.textContent).not.toContain("/me")
  })

  it(`shows "System" if no sender`, () => {
    const { queryByText } = setup({ senderName: undefined })
    expect(queryByText("System")).not.toBeNull()
  })
})
