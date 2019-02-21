import React from "react"
import { render } from "react-testing-library"
import MessageList from "./MessageList"
import MessageModel from "./MessageModel"

test("showing messages", async () => {
  const messages = [
    new MessageModel("aoi", "hello world", "chat"),
    new MessageModel("aoi", "message text", "chat"),
  ]

  const { queryByText, rerender } = render(<MessageList messages={messages} />)

  expect(queryByText("aoi")).not.toBeNull()
  expect(queryByText("hello world")).not.toBeNull()
  expect(queryByText("message text")).not.toBeNull()

  messages.push(new MessageModel("aoi", "new message!", "chat"))

  rerender(<MessageList messages={messages} />)

  expect(queryByText("new message!")).not.toBeNull()
})

test.todo("scrolling")
