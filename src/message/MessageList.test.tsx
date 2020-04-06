import { act } from "@testing-library/react"
import { observable } from "mobx"
import React from "react"
import { renderWithProviders } from "../test/renderWithProviders"
import { createMessageListModel } from "./message-list-model"
import { createChannelMessage } from "./message-model"
import MessageList from "./MessageList"

it("renders new messages as they come in", async () => {
  const list = observable(createMessageListModel())
  const messageText = `awesome message ${Math.random()}`
  const helpers = renderWithProviders(<MessageList list={list} />)

  expect(helpers.queryByText(messageText)).toBeNull()

  act(() => {
    list.add(createChannelMessage("Testificate", messageText))
  })

  expect(await helpers.findAllByText(messageText)).toHaveLength(1)

  act(() => {
    list.add(createChannelMessage("Testificate", messageText))
    list.add(createChannelMessage("Testificate", messageText))
  })

  expect(await helpers.findAllByText(messageText)).toHaveLength(3)
})
