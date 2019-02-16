import React from "react"
import { useRootStore } from "../RootStore"

const ChatSidebarContent = () => {
  const { channelStore, viewStore } = useRootStore()

  return (
    <nav>
      <ul>
        {channelStore.joinedChannels.map(({ id, name }) => (
          <li key={id}>
            <button
              onClick={() =>
                viewStore.setScreen({ name: "channel", channel: id })
              }
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
export default ChatSidebarContent
