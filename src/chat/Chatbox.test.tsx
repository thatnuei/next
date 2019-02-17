import React from "react"
import { fireEvent, render } from "react-testing-library"
import Chatbox from "./Chatbox"

test("sending message by pressing enter on input", () => {
  const handleSubmit = jest.fn()
  const { getByPlaceholderText } = render(<Chatbox onSubmit={handleSubmit} />)

  const input = getByPlaceholderText(/chatting as/i) as HTMLTextAreaElement
  fireEvent.change(input, { target: { value: "awesome message" } })
  fireEvent.keyDown(input, { key: "Enter" })

  expect(handleSubmit).toBeCalledWith("awesome message")
  expect(input.value).toBe("")
})

test("send button", () => {
  const handleSubmit = jest.fn()
  const { getByPlaceholderText, getByText } = render(
    <Chatbox onSubmit={handleSubmit} />,
  )

  const input = getByPlaceholderText(/chatting as/i) as HTMLTextAreaElement
  fireEvent.change(input, { target: { value: "awesome message" } })
  fireEvent.click(getByText(/send/i))

  expect(handleSubmit).toBeCalledWith("awesome message")
  expect(input.value).toBe("")
})

test("doesn't send message if holding shift or ctrl", () => {
  const handleSubmit = jest.fn()
  const { getByPlaceholderText } = render(<Chatbox onSubmit={handleSubmit} />)

  const input = getByPlaceholderText(/chatting as/i) as HTMLTextAreaElement
  fireEvent.change(input, { target: { value: "awesome message" } })
  fireEvent.keyDown(input, { key: "Enter", shiftKey: true })
  fireEvent.keyDown(input, { key: "Enter", ctrlKey: true })

  expect(handleSubmit).not.toBeCalled()
  expect(input.value).toBe("awesome message")
})
