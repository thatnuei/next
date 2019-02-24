import React from "react"
import { act, render } from "react-testing-library"
import CharacterStore from "../character/CharacterStore"
import MessageModel from "../message/MessageModel"
import ChannelModel from "./ChannelModel"
import ChannelRoomView from "./ChannelRoomView"

test("shows new messages", () => {
  const channel = new ChannelModel(new CharacterStore(), "Frontpage")

  const { queryByText } = render(<ChannelRoomView channel={channel} />)

  act(() => {
    channel.setMode("chat")
    channel.addMessage(new MessageModel("Testificate", "hello world", "chat"))
  })

  expect(queryByText("hello world")).not.toBeNull()
})
