import { act } from "@testing-library/react"
import React from "react"
import { renderWithProviders } from "../test/renderWithProviders"
import MessageList from "./MessageList"
import { MessageListState } from "./MessageListState"
import { createChannelMessage } from "./MessageState"

it.skip("renders new messages as they come in", async () => {
  const list = new MessageListState()
  const messageText = `awesome message ${Math.random()}`
  // @ts-expect-error
  const helpers = renderWithProviders(<MessageList messages={list} />)

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
