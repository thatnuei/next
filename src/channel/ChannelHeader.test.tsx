import "jest-dom/extend-expect"
import React from "react"
import { act, render } from "react-testing-library"
import CharacterStore from "../character/CharacterStore"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"

const setup = () => {
  const channel = new ChannelModel(new CharacterStore(), "Fantasy")
  const result = render(<ChannelHeader channel={channel} />)
  return { channel, ...result }
}

describe("ChannelHeader", () => {
  it("renders the channel name", () => {
    const { channel, queryByText } = setup()
    expect(queryByText(channel.name)).not.toBeNull()
  })

  it("shows filters", () => {
    const { channel, queryByText } = setup()
    expect(queryByText(/both/i)).not.toBeNull()
    expect(queryByText(/chat/i)).not.toBeNull()
    expect(queryByText(/ads/i)).not.toBeNull()

    act(() => {
      channel.setMode("chat")
    })

    expect(queryByText(/both/i)).not.toBeNull()
    expect(queryByText(/chat/i)).not.toBeNull()
    expect(queryByText(/ads/i)).not.toBeNull()
  })

  it("shows which filter is active", () => {})
})
