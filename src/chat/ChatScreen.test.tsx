import React from "react"
import { act, render } from "react-testing-library"
import RootStore, { RootStoreContext } from "../RootStore"
import ChatScreen from "./ChatScreen"

test("bug - continues to show new messages after switching channels", () => {
  const store = new RootStore()

  const { queryByText } = render(
    <RootStoreContext.Provider value={store}>
      <ChatScreen />
    </RootStoreContext.Provider>,
  )

  act(() => {
    store.chatStore.setIdentity("Testificate")

    store.viewStore.setScreen({
      name: "channel",
      channel: "Fantasy",
    })

    store.channelStore.handleSocketCommand({
      type: "JCH",
      params: {
        channel: "Frontpage",
        title: "Frontpage",
        character: { identity: "Testificate" },
      },
    })

    store.channelStore.handleSocketCommand({
      type: "ICH",
      params: {
        channel: "Frontpage",
        mode: "chat",
        users: [{ identity: "Testificate" }],
      },
    })

    store.channelStore.handleSocketCommand({
      type: "JCH",
      params: {
        channel: "Fantasy",
        title: "Fantasy",
        character: { identity: "Testificate" },
      },
    })

    store.channelStore.handleSocketCommand({
      type: "MSG",
      params: {
        channel: "Fantasy",
        character: "Testificate",
        message: "hello fantasy",
      },
    })
  })

  expect(queryByText("hello fantasy")).not.toBeNull()

  act(() => {
    store.viewStore.setScreen({
      name: "channel",
      channel: "Frontpage",
    })

    store.channelStore.handleSocketCommand({
      type: "MSG",
      params: {
        channel: "Frontpage",
        character: "Testificate",
        message: "hello frontpage",
      },
    })
  })

  expect(queryByText("hello fantasy")).toBeNull()
  expect(queryByText("hello frontpage")).not.toBeNull()
})
