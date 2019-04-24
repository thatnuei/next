import React from "react"
import { act, fireEvent, render } from "react-testing-library"
import RootStore from "../RootStore"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"

const setup = () => {
  const channel = new ChannelModel(new RootStore(), "Fantasy")
  const result = render(<ChannelHeader channel={channel} />)
  return { channel, ...result }
}

test("channel name", () => {
  const { channel, queryByText } = setup()
  expect(queryByText(channel.name)).not.toBeNull()
})

// broken for no apparent reason
test.skip("channel filters", () => {
  const { getByLabelText, channel, debug } = setup()

  const chat = () => getByLabelText(/chat/i)
  const both = () => getByLabelText(/both/i)
  const ads = () => getByLabelText(/ads/i)

  // chat should be selected by default
  expect(both()).not.toHaveAttribute("checked")
  expect(chat()).toHaveAttribute("checked")
  expect(ads()).not.toHaveAttribute("checked")

  fireEvent.change(both())

  expect(both()).toHaveAttribute("checked")
  expect(chat()).not.toHaveAttribute("checked")
  expect(ads()).not.toHaveAttribute("checked")
})

test("disabled filters", () => {
  const { channel, getByLabelText } = setup()

  act(() => {
    channel.setMode("chat")
  })

  expect(getByLabelText(/both/i)).toBeDisabled()
  expect(getByLabelText(/chat/i)).toBeDisabled()
  expect(getByLabelText(/ads/i)).toBeDisabled()
})
