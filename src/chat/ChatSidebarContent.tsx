import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import routePaths from "../app/routePaths"
import { Channel } from "../channel/types"
import { Link } from "../router"
import ChatStore from "./ChatStore"

type Props = {
  joinedChannels: Channel[]
}

export const ChatSidebarContent = ({ joinedChannels }: Props) => {
  return (
    <nav>
      <ul>
        {joinedChannels.map(({ id, name }) => (
          <li key={id}>
            <Link to={routePaths.channel(id)}>{name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default observer(() => {
  const { channelStore } = useContext(ChatStore.Context)
  return (
    <ChatSidebarContent joinedChannels={channelStore.getJoinedChannels()} />
  )
})
