import { createMemoryHistory } from "history"
import React from "react"
import { fireEvent, render } from "react-testing-library"
import routePaths from "../app/routePaths"
import { Router } from "../router"
import ChatSidebarContent from "./ChatSidebarContent"
import ChatStore from "./ChatStore"

describe("ChatSidebarContent", () => {
  const mockChannels = [
    { id: "Frontpage", name: "Frontpage" },
    { id: "Fantasy", name: "Fantasy" },
    { id: "fdsafdsafasdf", name: "Some Private Channel" },
  ]

  const mockChatStore = {
    channelStore: {
      getJoinedChannels: () => mockChannels,
    },
  }

  it("renders channel links which, when clicked, lead to the url for that channel", () => {
    const history = createMemoryHistory()

    const { getByText } = render(
      <Router history={history}>
        <ChatStore.Context.Provider value={mockChatStore as any}>
          <ChatSidebarContent />
        </ChatStore.Context.Provider>
      </Router>,
    )

    for (const channel of mockChannels) {
      const link = getByText(channel.name)
      fireEvent.click(link)
      expect(history.location.pathname).toBe(routePaths.channel(channel.id))
    }
  })
})
