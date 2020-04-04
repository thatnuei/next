import { act } from "@testing-library/react"
import React from "react"
import { renderWithProviders } from "../test/renderWithProviders"
import MessageList from "./MessageList"
import { MessageListModel } from "./MessageListModel"

describe("MessageListItem", () => {
  it("renders new messages as they come in", async () => {
    const list = new MessageListModel()
    const messageText = `awesome message ${Math.random()}`
    const helpers = renderWithProviders(<MessageList list={list} />)

    expect(helpers.queryByText(messageText)).toBeNull()

    act(() => {
      list.add(undefined, messageText, "normal", Date.now())
    })

    expect(await helpers.findAllByText(messageText)).toHaveLength(1)

    act(() => {
      list.add(undefined, messageText, "normal", Date.now())
      list.add(undefined, messageText, "normal", Date.now())
    })

    expect(await helpers.findAllByText(messageText)).toHaveLength(3)
  })
})
