import React from "react"
import { act, render } from "react-testing-library"
import RootStore, { RootStoreContext } from "../RootStore"
import ChannelRoomView from "./ChannelRoomView"

test("shows new messages", () => {
  const store = new RootStore()

  const { queryByText } = render(
    <RootStoreContext.Provider value={store}>
      <ChannelRoomView channel={store.channelStore.channels.get("Frontpage")} />
    </RootStoreContext.Provider>,
  )

  act(() => {
    store.channelStore.handleSocketCommand({
      type: "MSG",
      params: {
        channel: "Frontpage",
        character: "Testificate",
        message: "hello world",
      },
    })
  })

  expect(queryByText("hello world")).not.toBeNull()
})
