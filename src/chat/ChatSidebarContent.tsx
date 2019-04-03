import React from "react"
import { useRootStore } from "../RootStore"

const ChatSidebarContent = () => {
  const { channelStore, privateChatStore, viewStore } = useRootStore()

  return (
    <>
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

      <ul>
        {[...privateChatStore.chatPartnerNames].map((partnerName) => (
          <li key={partnerName}>
            <button
              onClick={() =>
                viewStore.setScreen({ name: "privateChat", partnerName })
              }
            >
              {partnerName}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
export default ChatSidebarContent
