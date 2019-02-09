import React from "react"
import { render } from "react-testing-library"
import { ServerCommand } from "../fchat/types"
import RootStore, { RootStoreContext } from "../RootStore"
import ChatSidebarContent from "./ChatSidebarContent"

const createJoinedChannelCommand = (
  identity: string,
  id: string,
  name = id,
): ServerCommand => ({
  type: "JCH",
  params: {
    channel: id,
    character: { identity },
    title: name,
  },
})

describe("ChatSidebarContent", () => {
  const store = new RootStore()
  const identity = "nobody"

  store.chatStore.identity = identity

  store.channelStore.handleSocketCommand(
    createJoinedChannelCommand(identity, "Frontpage"),
  )
  store.channelStore.handleSocketCommand(
    createJoinedChannelCommand(identity, "Fantasy"),
  )
  store.channelStore.handleSocketCommand(
    createJoinedChannelCommand(identity, "dsfjkladfjkl", "random channel"),
  )

  it("renders channel buttons", () => {
    const { queryByText } = render(
      <RootStoreContext.Provider value={store}>
        <ChatSidebarContent />
      </RootStoreContext.Provider>,
    )

    for (const channel of store.channelStore.channels.values) {
      expect(queryByText(channel.name)).not.toBeNull()
    }
  })
})
